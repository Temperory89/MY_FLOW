import React, { useState } from 'react';
import { ComponentData } from '../../types';

interface Tab {
  id: string;
  label: string;
  content: string;
  icon?: string;
  disabled?: boolean;
}

interface TabsComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const Tabs: React.FC<TabsComponentProps> = ({ component, isPreview = false }) => {
  const tabs: Tab[] = component.props.tabs || [
    { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content for tab 3' }
  ];

  const [activeTab, setActiveTab] = useState(component.props.defaultTab || tabs[0]?.id);

  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style
  };

  const variant = component.props.variant || 'line';
  const position = component.props.position || 'top';
  const alignment = component.props.alignment || 'start';

  if (!component.props.visible) return null;

  const currentTab = tabs.find(t => t.id === activeTab);

  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch'
  };

  return (
    <div style={baseStyle} className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className={`flex ${alignmentClasses[alignment]} border-b border-gray-200 bg-gray-50 px-4`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`
                relative px-4 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${variant === 'enclosed' ? 'border border-b-0 rounded-t-lg' : ''}
                ${variant === 'pills' ? 'rounded-lg mx-1' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {currentTab && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentTab.content}
          </div>
        )}
      </div>
    </div>
  );
};
