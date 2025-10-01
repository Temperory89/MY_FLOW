import React, { useEffect, useState, useCallback } from 'react';
import { ComponentData, AppPage } from '../types';
import { expressionEngine, EvaluationContext } from './ExpressionEngine';
import { actionManager } from './ActionManager';
import { RenderComponent } from '../components/canvas/RenderComponent';

interface RuntimeRendererProps {
  page: AppPage;
  components: ComponentData[];
}

export const RuntimeRenderer: React.FC<RuntimeRendererProps> = ({ page, components }) => {
  const [widgetsState, setWidgetsState] = useState<Record<string, any>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const initialState: Record<string, any> = {};

    components.forEach(component => {
      initialState[component.id] = {
        id: component.id,
        type: component.type,
        ...component.props,
        visible: component.props.visible !== false
      };
    });

    setWidgetsState(initialState);
  }, [components]);

  useEffect(() => {
    const context: EvaluationContext = {
      widgets: widgetsState,
      actions: {},
      page: {
        name: page.name,
        route: page.route
      },
      utils: expressionEngine['context'].utils,
      store: {}
    };

    expressionEngine.updateContext(context);

    actionManager.onWidgetUpdate((widgetId, updates) => {
      setWidgetsState(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          ...updates
        }
      }));
      setRefreshKey(k => k + 1);
    });
  }, [widgetsState, page]);

  const evaluateComponentProps = useCallback((component: ComponentData): ComponentData => {
    const evaluatedProps: Record<string, any> = {};

    for (const [key, value] of Object.entries(component.props)) {
      if (typeof value === 'string' && expressionEngine.hasExpression(value)) {
        evaluatedProps[key] = expressionEngine.evaluate(value);
      } else if (typeof value === 'string') {
        evaluatedProps[key] = expressionEngine.evaluateTemplate(value);
      } else {
        evaluatedProps[key] = value;
      }
    }

    return {
      ...component,
      props: evaluatedProps
    };
  }, [refreshKey]);

  return (
    <div className="relative w-full h-full bg-white">
      {components.map(component => {
        const evaluatedComponent = evaluateComponentProps(component);

        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: component.x,
              top: component.y,
              width: component.width,
              height: component.height
            }}
          >
            <RenderComponent component={evaluatedComponent} isPreview={true} />
          </div>
        );
      })}
    </div>
  );
};

export interface RuntimeConfig {
  components: ComponentData[];
  page: AppPage;
  theme?: any;
  enableBindings?: boolean;
  enableActions?: boolean;
}

export const createRuntime = (config: RuntimeConfig) => {
  const { components, page, enableBindings = true, enableActions = true } = config;

  if (enableBindings) {
    const widgetsMap: Record<string, any> = {};

    components.forEach(component => {
      widgetsMap[component.id] = {
        id: component.id,
        type: component.type,
        ...component.props
      };
    });

    expressionEngine.updateContext({
      widgets: widgetsMap,
      actions: {},
      page: {
        name: page.name,
        route: page.route
      },
      utils: expressionEngine['context'].utils,
      store: {}
    });
  }

  return {
    evaluate: (expression: string) => expressionEngine.evaluate(expression),
    evaluateTemplate: (template: string) => expressionEngine.evaluateTemplate(template),
    runAction: (actionId: string, params?: any) => actionManager.run(actionId, params),
    updateWidget: (widgetId: string, updates: any) => {
      if (enableActions) {
        actionManager.run('updateWidget', { widgetId, updates });
      }
    }
  };
};
