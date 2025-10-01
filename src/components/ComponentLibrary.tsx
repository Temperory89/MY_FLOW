import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

import { ComponentDefinition } from '../types';

const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'button',
    name: 'Button',
    icon: 'Square',
    defaultProps: { 
      label: 'Click me', 
      tooltip: '',
      visible: true,
      disabled: false,
      loading: false,
      variant: 'primary',
      size: 'md',
      actions: { onClick: { type: 'alert', params: { message: 'Button clicked!' } } }
    },
    defaultStyle: { backgroundColor: '#3B82F6', color: 'white', borderRadius: '6px', border: 'none', padding: '8px 16px', cursor: 'pointer' },
    defaultSize: { width: 120, height: 40 },
    category: 'basic',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Click me' },
      { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'loading', label: 'Loading', type: 'boolean', defaultValue: false },
      { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'], defaultValue: 'primary' },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' }
    ]
  },
  {
    type: 'input',
    name: 'Input',
    icon: 'Type',
    defaultProps: { 
      label: 'Input Label',
      placeholder: 'Enter text...', 
      value: '',
      type: 'text',
      disabled: false,
      readonly: false,
      required: false,
      validation: {},
      maxLength: 100,
      showCharacterCount: false,
      visible: true
    },
    defaultStyle: { border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 12px', fontSize: '14px' },
    defaultSize: { width: 200, height: 40 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Input Label' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Enter text...' },
      { key: 'type', label: 'Type', type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'], defaultValue: 'text' },
      { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'readonly', label: 'Read Only', type: 'boolean', defaultValue: false }
    ]
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    defaultProps: { 
      content: 'Sample text', 
      richText: false,
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#1F2937',
      textAlign: 'left',
      visible: true,
      lineHeight: '1.5',
      letterSpacing: 'normal',
      textDecoration: 'none',
      textTransform: 'none'
    },
    defaultStyle: { color: '#1F2937', lineHeight: '1.5' },
    defaultSize: { width: 150, height: 30 },
    category: 'basic',
    propertySchema: [
      { key: 'content', label: 'Content', type: 'textarea', defaultValue: 'Sample text' },
      { key: 'richText', label: 'Rich Text', type: 'boolean', defaultValue: false },
      { key: 'fontSize', label: 'Font Size', type: 'text', defaultValue: '16px' },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], defaultValue: 'normal' },
      { key: 'color', label: 'Color', type: 'color', defaultValue: '#1F2937' },
      { key: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true }
    ]
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    defaultProps: { 
      src: 'https://images.pexels.com/photos/3685175/pexels-photo-3685175.jpeg?auto=compress&cs=tinysrgb&w=400', 
      alt: 'Sample image',
      fit: 'cover',
      clickAction: { type: 'none' },
      visible: true,
      borderRadius: '0px',
      opacity: 1,
      grayscale: false,
      blur: 0
    },
    defaultStyle: { borderRadius: '6px', objectFit: 'cover' },
    defaultSize: { width: 200, height: 150 },
    category: 'basic',
    propertySchema: [
      { key: 'src', label: 'Image URL', type: 'url', defaultValue: '' },
      { key: 'alt', label: 'Alt Text', type: 'text', defaultValue: 'Image' },
      { key: 'fit', label: 'Fit Mode', type: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'], defaultValue: 'cover' }
    ]
  },
  {
    type: 'table',
    name: 'Table',
    icon: 'Table',
    defaultProps: {
      columns: [
        { key: 'name', name: 'Name', type: 'text', visible: true, sortable: true, filterable: true },
        { key: 'email', name: 'Email', type: 'link', visible: true, sortable: true, filterable: true },
        { key: 'role', name: 'Role', type: 'badge', visible: true, sortable: true, filterable: true },
        { key: 'status', name: 'Status', type: 'badge', visible: true, sortable: true, filterable: true }
      ],
      dataSource: 'static',
      data: [],
      pagination: { 
        enabled: true, 
        pageSize: 10,
        showPageSizeOptions: true,
        pageSizeOptions: [5, 10, 25, 50]
      },
      sorting: { 
        enabled: true,
        defaultSort: 'name',
        defaultOrder: 'asc'
      },
      filtering: { 
        enabled: true,
        searchPlaceholder: 'Search table...'
      },
      selection: { 
        mode: 'multiple',
        showSelectAll: true
      },
      rowActions: [],
      visible: true,
      compact: false,
      striped: true,
      bordered: false,
      hoverable: true
    },
    defaultStyle: { border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: 'white' },
    defaultSize: { width: 600, height: 400 },
    category: 'data',
    propertySchema: [
      { key: 'dataSource', label: 'Data Source', type: 'select', options: ['static', 'api', 'query'], defaultValue: 'static' }
    ]
  },
  {
    type: 'select',
    name: 'Select',
    icon: 'ChevronDown',
    defaultProps: {
      label: 'Select Label',
      placeholder: 'Choose an option...',
      value: '',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      multiple: false,
      searchable: false,
      clearable: true,
      disabled: false,
      required: false,
      visible: true,
      loading: false,
      maxHeight: 200
    },
    defaultStyle: { border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white' },
    defaultSize: { width: 200, height: 40 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Select Label' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Choose an option...' },
      { key: 'multiple', label: 'Multiple Selection', type: 'boolean', defaultValue: false },
      { key: 'searchable', label: 'Searchable', type: 'boolean', defaultValue: false },
      { key: 'clearable', label: 'Clearable', type: 'boolean', defaultValue: true }
    ]
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'CheckSquare',
    defaultProps: {
      label: 'Checkbox Label',
      checked: false,
      disabled: false,
      required: false,
      visible: true,
      indeterminate: false,
      color: '#3B82F6',
      size: 'md'
    },
    defaultStyle: {},
    defaultSize: { width: 150, height: 30 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Checkbox Label' },
      { key: 'checked', label: 'Checked', type: 'boolean', defaultValue: false },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
      { key: 'color', label: 'Color', type: 'color', defaultValue: '#3B82F6' }
    ]
  },
  {
    type: 'customfunction',
    name: 'Custom Function',
    icon: 'Code',
    defaultProps: {
      html: '<div class="custom-component"><h3>Custom Component</h3><p>Add your HTML, CSS, and JavaScript here!</p></div>',
      css: '.custom-component { padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); } .custom-component h3 { margin-bottom: 10px; font-size: 1.2em; }',
      javascript: 'console.log("Custom component loaded!"); document.querySelector(".custom-component").addEventListener("click", () => alert("Custom component clicked!"));',
      props: {},
      visible: true,
      height: 200
    },
    defaultStyle: { border: '1px solid #E5E7EB', borderRadius: '6px' },
    defaultSize: { width: 300, height: 200 },
    category: 'custom',
    propertySchema: [
      { key: 'html', label: 'HTML', type: 'code', defaultValue: '' },
      { key: 'css', label: 'CSS', type: 'code', defaultValue: '' },
      { key: 'javascript', label: 'JavaScript', type: 'code', defaultValue: '' },
      { key: 'height', label: 'Height', type: 'number', defaultValue: 200 }
    ]
  },
  {
    type: 'modal',
    name: 'Modal',
    icon: 'Square',
    defaultProps: {
      isOpen: false,
      title: 'Modal Title',
      content: 'Modal content goes here',
      size: 'md',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 400, height: 300 },
    category: 'layout',
    propertySchema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Modal Title' },
      { key: 'content', label: 'Content', type: 'textarea', defaultValue: 'Modal content' },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'], defaultValue: 'md' },
      { key: 'isOpen', label: 'Open by Default', type: 'boolean', defaultValue: false }
    ]
  },
  {
    type: 'tabs',
    name: 'Tabs',
    icon: 'Layout',
    defaultProps: {
      tabs: [
        { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' },
        { id: 'tab3', label: 'Tab 3', content: 'Content for tab 3' }
      ],
      defaultTab: 'tab1',
      variant: 'line',
      position: 'top',
      alignment: 'start',
      visible: true
    },
    defaultStyle: { border: '1px solid #E5E7EB', borderRadius: '6px' },
    defaultSize: { width: 500, height: 300 },
    category: 'layout',
    propertySchema: [
      { key: 'variant', label: 'Variant', type: 'select', options: ['line', 'enclosed', 'pills'], defaultValue: 'line' },
      { key: 'alignment', label: 'Alignment', type: 'select', options: ['start', 'center', 'end', 'stretch'], defaultValue: 'start' }
    ]
  },
  {
    type: 'form',
    name: 'Form',
    icon: 'FileText',
    defaultProps: {
      title: 'Contact Form',
      description: 'Please fill out the form below',
      fields: [
        { id: 'name', name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter your name' },
        { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
        { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message' }
      ],
      submitLabel: 'Submit',
      resetLabel: 'Reset',
      showResetButton: true,
      resetOnSuccess: true,
      visible: true
    },
    defaultStyle: { border: '1px solid #E5E7EB', borderRadius: '6px' },
    defaultSize: { width: 500, height: 400 },
    category: 'form',
    propertySchema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Contact Form' },
      { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
      { key: 'submitLabel', label: 'Submit Label', type: 'text', defaultValue: 'Submit' }
    ]
  },
  {
    type: 'datepicker',
    name: 'Date Picker',
    icon: 'Calendar',
    defaultProps: {
      label: 'Select Date',
      placeholder: 'Choose a date...',
      value: null,
      format: 'MM/DD/YYYY',
      required: false,
      disabled: false,
      visible: true,
      showTodayButton: true
    },
    defaultStyle: {},
    defaultSize: { width: 250, height: 70 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Select Date' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Choose a date...' },
      { key: 'format', label: 'Format', type: 'select', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], defaultValue: 'MM/DD/YYYY' },
      { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false }
    ]
  }
];



interface ComponentItemProps {
  definition: ComponentDefinition;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ definition }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { componentType: definition.type, definition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Fallback: just render a placeholder if iconMap is not available
  const IconComponent = () => <span className="w-4 h-4 inline-block bg-gray-500 rounded" />;

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-move transition-all ${
        isDragging 
          ? 'opacity-50 bg-blue-600 scale-105' 
          : 'hover:bg-gray-700 bg-gray-750 hover:scale-102'
      }`}
    >
      <div className="p-2 bg-gray-600 rounded-lg">
  <IconComponent />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-white">{definition.name}</span>
        <div className="text-xs text-gray-400 capitalize">{definition.category}</div>
      </div>
    </div>
  );
};

export const ComponentLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    { id: 'all', name: 'All Components', count: componentDefinitions.length },
    { id: 'basic', name: 'Basic', count: componentDefinitions.filter(d => d.category === 'basic').length },
    { id: 'form', name: 'Form', count: componentDefinitions.filter(d => d.category === 'form').length },
    { id: 'data', name: 'Data', count: componentDefinitions.filter(d => d.category === 'data').length },
    { id: 'layout', name: 'Layout', count: componentDefinitions.filter(d => d.category === 'layout').length },
    { id: 'custom', name: 'Custom', count: componentDefinitions.filter(d => d.category === 'custom').length }
  ];

  const filteredComponents = componentDefinitions.filter(def => {
    const matchesCategory = selectedCategory === 'all' || def.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      def.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Components</h3>
        <div className="text-xs text-gray-400 bg-gray-750 px-2 py-1 rounded">
          {filteredComponents.length} items
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components..."
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      
      {/* Category Filter */}
      <div className="mb-4">
        <div className="grid grid-cols-1 gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs opacity-75">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="space-y-2">
        {filteredComponents.map((def) => (
          <ComponentItem key={def.type} definition={def} />
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No components found in this category</p>
        </div>
      )}
    </div>
  );
};