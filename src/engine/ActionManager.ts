import { expressionEngine } from './ExpressionEngine';

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ActionDefinition {
  id: string;
  type: 'http' | 'graphql' | 'updateWidget' | 'navigate' | 'openModal' | 'closeModal' | 'showAlert' | 'showToast' | 'localStorage' | 'copyToClipboard' | 'downloadFile' | 'runJS';
  config: Record<string, any>;
}

export type ActionListener = (result: ActionResult) => void;

export class ActionManager {
  private actions: Map<string, ActionDefinition>;
  private listeners: Map<string, Set<ActionListener>>;
  private results: Map<string, ActionResult>;
  private widgetUpdateCallback?: (widgetId: string, updates: any) => void;
  private navigationCallback?: (path: string, params?: any) => void;
  private modalCallback?: (modalId: string, action: 'open' | 'close') => void;

  constructor() {
    this.actions = new Map();
    this.listeners = new Map();
    this.results = new Map();
  }

  registerAction(action: ActionDefinition) {
    this.actions.set(action.id, action);
  }

  unregisterAction(actionId: string) {
    this.actions.delete(actionId);
    this.listeners.delete(actionId);
    this.results.delete(actionId);
  }

  onWidgetUpdate(callback: (widgetId: string, updates: any) => void) {
    this.widgetUpdateCallback = callback;
  }

  onNavigation(callback: (path: string, params?: any) => void) {
    this.navigationCallback = callback;
  }

  onModal(callback: (modalId: string, action: 'open' | 'close') => void) {
    this.modalCallback = callback;
  }

  addListener(actionId: string, listener: ActionListener) {
    if (!this.listeners.has(actionId)) {
      this.listeners.set(actionId, new Set());
    }
    this.listeners.get(actionId)!.add(listener);
  }

  removeListener(actionId: string, listener: ActionListener) {
    this.listeners.get(actionId)?.delete(listener);
  }

  getResult(actionId: string): ActionResult | undefined {
    return this.results.get(actionId);
  }

  async run(actionId: string, params?: Record<string, any>): Promise<ActionResult> {
    const action = this.actions.get(actionId);

    if (!action) {
      const result: ActionResult = {
        success: false,
        error: `Action not found: ${actionId}`
      };
      this.notifyListeners(actionId, result);
      return result;
    }

    try {
      const result = await this.executeAction(action, params);
      this.results.set(actionId, result);
      this.notifyListeners(actionId, result);
      return result;
    } catch (error) {
      const result: ActionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.results.set(actionId, result);
      this.notifyListeners(actionId, result);
      return result;
    }
  }

  private async executeAction(action: ActionDefinition, params?: Record<string, any>): Promise<ActionResult> {
    switch (action.type) {
      case 'http':
        return await this.executeHttpAction(action, params);
      case 'graphql':
        return await this.executeGraphQLAction(action, params);
      case 'updateWidget':
        return this.executeUpdateWidgetAction(action, params);
      case 'navigate':
        return this.executeNavigateAction(action, params);
      case 'openModal':
        return this.executeModalAction(action, 'open');
      case 'closeModal':
        return this.executeModalAction(action, 'close');
      case 'showAlert':
        return this.executeAlertAction(action, params);
      case 'showToast':
        return this.executeToastAction(action, params);
      case 'localStorage':
        return this.executeLocalStorageAction(action, params);
      case 'copyToClipboard':
        return this.executeCopyToClipboardAction(action, params);
      case 'downloadFile':
        return this.executeDownloadFileAction(action, params);
      case 'runJS':
        return this.executeRunJSAction(action, params);
      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  private async executeHttpAction(action: ActionDefinition, params?: Record<string, any>): Promise<ActionResult> {
    const { url, method = 'GET', headers = {}, body, timeout = 30000 } = action.config;

    const evaluatedUrl = expressionEngine.evaluateTemplate(url);
    const evaluatedHeaders: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
      evaluatedHeaders[key] = expressionEngine.evaluateTemplate(String(value));
    }

    const evaluatedBody = body ? expressionEngine.evaluateTemplate(JSON.stringify(body)) : undefined;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(evaluatedUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...evaluatedHeaders
        },
        body: evaluatedBody,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async executeGraphQLAction(action: ActionDefinition, params?: Record<string, any>): Promise<ActionResult> {
    const { url, query, variables = {}, headers = {} } = action.config;

    const evaluatedUrl = expressionEngine.evaluateTemplate(url);
    const evaluatedQuery = expressionEngine.evaluateTemplate(query);
    const evaluatedVariables = JSON.parse(expressionEngine.evaluateTemplate(JSON.stringify(variables)));

    const response = await fetch(evaluatedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        query: evaluatedQuery,
        variables: evaluatedVariables
      })
    });

    const result = await response.json();

    if (result.errors) {
      return {
        success: false,
        error: result.errors.map((e: any) => e.message).join(', '),
        data: result.data
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  private executeUpdateWidgetAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { widgetId, updates } = action.config;

    const evaluatedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string' && expressionEngine.hasExpression(value)) {
        evaluatedUpdates[key] = expressionEngine.evaluate(value);
      } else {
        evaluatedUpdates[key] = value;
      }
    }

    if (this.widgetUpdateCallback) {
      this.widgetUpdateCallback(widgetId, evaluatedUpdates);
    }

    return {
      success: true,
      data: { widgetId, updates: evaluatedUpdates }
    };
  }

  private executeNavigateAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { path, queryParams } = action.config;
    const evaluatedPath = expressionEngine.evaluateTemplate(path);

    if (this.navigationCallback) {
      this.navigationCallback(evaluatedPath, queryParams);
    } else {
      window.location.href = evaluatedPath;
    }

    return {
      success: true,
      data: { path: evaluatedPath }
    };
  }

  private executeModalAction(action: ActionDefinition, modalAction: 'open' | 'close'): ActionResult {
    const { modalId } = action.config;

    if (this.modalCallback) {
      this.modalCallback(modalId, modalAction);
    }

    return {
      success: true,
      data: { modalId, action: modalAction }
    };
  }

  private executeAlertAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { message, title } = action.config;
    const evaluatedMessage = expressionEngine.evaluateTemplate(message);

    alert(evaluatedMessage);

    return {
      success: true,
      data: { message: evaluatedMessage }
    };
  }

  private executeToastAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { message, type = 'info', duration = 3000 } = action.config;
    const evaluatedMessage = expressionEngine.evaluateTemplate(message);

    console.log(`[Toast ${type}]:`, evaluatedMessage);

    return {
      success: true,
      data: { message: evaluatedMessage, type, duration }
    };
  }

  private executeLocalStorageAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { operation, key, value } = action.config;

    switch (operation) {
      case 'set':
        localStorage.setItem(key, JSON.stringify(value));
        return { success: true, data: { key, value } };
      case 'get':
        const storedValue = localStorage.getItem(key);
        return {
          success: true,
          data: storedValue ? JSON.parse(storedValue) : null
        };
      case 'remove':
        localStorage.removeItem(key);
        return { success: true, data: { key } };
      case 'clear':
        localStorage.clear();
        return { success: true };
      default:
        throw new Error(`Unknown localStorage operation: ${operation}`);
    }
  }

  private executeCopyToClipboardAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { text } = action.config;
    const evaluatedText = expressionEngine.evaluateTemplate(text);

    navigator.clipboard.writeText(evaluatedText);

    return {
      success: true,
      data: { text: evaluatedText }
    };
  }

  private executeDownloadFileAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { url, filename } = action.config;
    const evaluatedUrl = expressionEngine.evaluateTemplate(url);
    const evaluatedFilename = expressionEngine.evaluateTemplate(filename);

    const a = document.createElement('a');
    a.href = evaluatedUrl;
    a.download = evaluatedFilename;
    a.click();

    return {
      success: true,
      data: { url: evaluatedUrl, filename: evaluatedFilename }
    };
  }

  private executeRunJSAction(action: ActionDefinition, params?: Record<string, any>): ActionResult {
    const { code } = action.config;

    try {
      const result = expressionEngine.evaluate(code, true);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private notifyListeners(actionId: string, result: ActionResult) {
    const listeners = this.listeners.get(actionId);
    if (listeners) {
      listeners.forEach(listener => listener(result));
    }
  }

  async runActionChain(actionIds: string[], params?: Record<string, any>): Promise<ActionResult[]> {
    const results: ActionResult[] = [];

    for (const actionId of actionIds) {
      const result = await this.run(actionId, params);
      results.push(result);

      if (!result.success) {
        break;
      }
    }

    return results;
  }
}

export const actionManager = new ActionManager();
