export interface EvaluationContext {
  widgets: Record<string, any>;
  actions: Record<string, any>;
  page: Record<string, any>;
  utils: Record<string, any>;
  store: Record<string, any>;
}

export class ExpressionEngine {
  private context: EvaluationContext;
  private cache: Map<string, { value: any; deps: Set<string> }>;

  constructor() {
    this.context = {
      widgets: {},
      actions: {},
      page: {},
      utils: this.createUtilsObject(),
      store: {}
    };
    this.cache = new Map();
  }

  private createUtilsObject() {
    return {
      formatDate: (date: Date | string, format: string = 'short') => {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (format === 'short') return d.toLocaleDateString();
        if (format === 'long') return d.toLocaleString();
        return d.toISOString();
      },
      formatCurrency: (value: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency
        }).format(value);
      },
      formatNumber: (value: number, decimals: number = 0) => {
        return value.toFixed(decimals);
      },
      parseJSON: (json: string) => {
        try {
          return JSON.parse(json);
        } catch {
          return null;
        }
      },
      stringifyJSON: (obj: any) => {
        try {
          return JSON.stringify(obj);
        } catch {
          return '';
        }
      },
      toLowerCase: (str: string) => str.toLowerCase(),
      toUpperCase: (str: string) => str.toUpperCase(),
      trim: (str: string) => str.trim(),
      split: (str: string, delimiter: string) => str.split(delimiter),
      join: (arr: any[], delimiter: string) => arr.join(delimiter),
      map: (arr: any[], fn: (item: any) => any) => arr.map(fn),
      filter: (arr: any[], fn: (item: any) => boolean) => arr.filter(fn),
      find: (arr: any[], fn: (item: any) => boolean) => arr.find(fn),
      sum: (arr: number[]) => arr.reduce((sum, val) => sum + val, 0),
      average: (arr: number[]) => arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0,
      min: (arr: number[]) => Math.min(...arr),
      max: (arr: number[]) => Math.max(...arr),
      round: (num: number) => Math.round(num),
      floor: (num: number) => Math.floor(num),
      ceil: (num: number) => Math.ceil(num),
      random: () => Math.random(),
      randomInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
      uuid: () => crypto.randomUUID(),
      now: () => new Date(),
      timestamp: () => Date.now()
    };
  }

  updateContext(context: Partial<EvaluationContext>) {
    this.context = {
      ...this.context,
      ...context
    };
    this.clearCache();
  }

  clearCache() {
    this.cache.clear();
  }

  extractExpressions(text: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const expressions: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      expressions.push(match[1].trim());
    }

    return expressions;
  }

  evaluate(expression: string, throwOnError: boolean = false): any {
    if (!expression) return '';

    const cacheKey = expression;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.value;
    }

    try {
      const sanitizedExpression = this.sanitizeExpression(expression);

      const fn = new Function(
        'widgets',
        'actions',
        'page',
        'utils',
        'store',
        `
          'use strict';
          try {
            return (${sanitizedExpression});
          } catch (error) {
            ${throwOnError ? 'throw error;' : 'return undefined;'}
          }
        `
      );

      const result = fn(
        this.context.widgets,
        this.context.actions,
        this.context.page,
        this.context.utils,
        this.context.store
      );

      this.cache.set(cacheKey, { value: result, deps: new Set() });
      return result;
    } catch (error) {
      if (throwOnError) {
        throw error;
      }
      console.warn('Expression evaluation error:', expression, error);
      return undefined;
    }
  }

  evaluateTemplate(template: string, throwOnError: boolean = false): string {
    if (!template) return '';

    const regex = /\{\{([^}]+)\}\}/g;

    try {
      return template.replace(regex, (match, expression) => {
        const result = this.evaluate(expression.trim(), throwOnError);
        return result !== undefined && result !== null ? String(result) : '';
      });
    } catch (error) {
      if (throwOnError) {
        throw error;
      }
      console.warn('Template evaluation error:', template, error);
      return template;
    }
  }

  private sanitizeExpression(expression: string): string {
    const forbidden = [
      'eval',
      'Function',
      'constructor',
      'prototype',
      '__proto__',
      'window',
      'document',
      'global',
      'process',
      'require',
      'import',
      'fetch',
      'XMLHttpRequest'
    ];

    for (const keyword of forbidden) {
      if (expression.includes(keyword)) {
        throw new Error(`Forbidden keyword in expression: ${keyword}`);
      }
    }

    return expression;
  }

  hasExpression(text: string): boolean {
    return /\{\{([^}]+)\}\}/.test(text);
  }

  getDependencies(expression: string): string[] {
    const deps: string[] = [];
    const widgetRegex = /widgets\.(\w+)/g;
    const actionRegex = /actions\.(\w+)/g;
    const pageRegex = /page\.(\w+)/g;

    let match;

    while ((match = widgetRegex.exec(expression)) !== null) {
      deps.push(`widgets.${match[1]}`);
    }

    while ((match = actionRegex.exec(expression)) !== null) {
      deps.push(`actions.${match[1]}`);
    }

    while ((match = pageRegex.exec(expression)) !== null) {
      deps.push(`page.${match[1]}`);
    }

    return [...new Set(deps)];
  }

  validateExpression(expression: string): { valid: boolean; error?: string } {
    try {
      this.sanitizeExpression(expression);
      this.evaluate(expression, true);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const expressionEngine = new ExpressionEngine();
