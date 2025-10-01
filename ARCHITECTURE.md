# Low-Code Platform Architecture

> A comprehensive UI-only low-code builder inspired by Appsmith and Retool

## Overview

This platform is a full-featured, UI-only low-code builder that enables rapid application development through drag-and-drop components, declarative bindings, and visual property editors.

## Core Systems

### 1. Expression Engine (`src/engine/ExpressionEngine.ts`)

The Expression Engine provides safe evaluation of JavaScript-like expressions in `{{ }}` syntax.

**Features:**
- Sandboxed expression evaluation (no access to `window`, `document`, etc.)
- Template string evaluation with multiple expressions
- Built-in utility functions (formatDate, formatCurrency, etc.)
- Dependency tracking for reactive updates
- Result caching for performance

**Usage Example:**
```typescript
import { expressionEngine } from './engine/ExpressionEngine';

// Simple evaluation
expressionEngine.evaluate('2 + 2'); // 4

// Template evaluation with context
expressionEngine.updateContext({
  widgets: {
    input1: { value: 'Hello' },
    input2: { value: 'World' }
  }
});

expressionEngine.evaluateTemplate('{{ widgets.input1.value }} {{ widgets.input2.value }}');
// "Hello World"
```

**Utility Functions:**
- `formatDate(date, format)` - Format dates
- `formatCurrency(value, currency)` - Format currency values
- `formatNumber(value, decimals)` - Format numbers
- `parseJSON(json)` / `stringifyJSON(obj)` - JSON operations
- Array operations: `map`, `filter`, `find`, `sum`, `average`, `min`, `max`
- String operations: `toLowerCase`, `toUpperCase`, `trim`, `split`, `join`
- Math operations: `round`, `floor`, `ceil`, `random`, `randomInt`
- Utilities: `uuid()`, `now()`, `timestamp()`

### 2. Action Manager (`src/engine/ActionManager.ts`)

The Action Manager handles all side effects and user actions.

**Supported Action Types:**
- `http` - REST API calls with templated URLs, headers, and body
- `graphql` - GraphQL queries with variables
- `updateWidget` - Update component properties dynamically
- `navigate` - Navigate to different pages/routes
- `openModal` / `closeModal` - Modal operations
- `showAlert` / `showToast` - User notifications
- `localStorage` - Local storage operations (get, set, remove, clear)
- `copyToClipboard` - Copy text to clipboard
- `downloadFile` - Trigger file downloads
- `runJS` - Execute custom JavaScript

**Usage Example:**
```typescript
import { actionManager } from './engine/ActionManager';

// Register an HTTP action
actionManager.registerAction({
  id: 'fetchUsers',
  type: 'http',
  config: {
    url: 'https://api.example.com/users',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer {{ store.token }}'
    },
    timeout: 30000
  }
});

// Run the action
const result = await actionManager.run('fetchUsers');
if (result.success) {
  console.log('Users:', result.data);
}

// Listen for action results
actionManager.addListener('fetchUsers', (result) => {
  console.log('Action completed:', result);
});
```

### 3. History Manager (`src/engine/HistoryManager.ts`)

Provides undo/redo functionality for all canvas operations.

**Features:**
- Records all component operations (add, update, delete, move, resize)
- Configurable history size (default 50 entries)
- Efficient undo/redo with state snapshots
- Timestamp tracking for each operation

**Usage Example:**
```typescript
import { historyManager } from './engine/HistoryManager';

// Record operations automatically
historyManager.recordComponentAdd(component);
historyManager.recordComponentUpdate(id, before, after);

// Undo/Redo
if (historyManager.canUndo()) {
  const entry = historyManager.undo();
  // Apply the undo operation
}

if (historyManager.canRedo()) {
  const entry = historyManager.redo();
  // Apply the redo operation
}
```

### 4. Runtime Renderer (`src/engine/RuntimeRenderer.tsx`)

Renders pages with live binding evaluation and reactive updates.

**Features:**
- Live expression evaluation during runtime
- Automatic re-evaluation on dependency changes
- Widget state management
- Integration with Expression Engine and Action Manager

**Usage Example:**
```tsx
import { RuntimeRenderer } from './engine/RuntimeRenderer';

<RuntimeRenderer
  page={currentPage}
  components={components}
/>
```

### 5. Persistence Service (`src/services/PersistenceService.ts`)

Handles data persistence using Supabase and localStorage.

**Features:**
- Supabase integration for cloud storage
- Project and page management
- Auto-save functionality
- LocalStorage fallback for offline work

**Usage Example:**
```typescript
import { persistenceService } from './services/PersistenceService';

// Save project
const result = await persistenceService.saveProject(
  'My Project',
  'Project description',
  pages,
  settings
);

// Load project
const { project, pages } = await persistenceService.loadProject(projectId);

// Auto-save
await persistenceService.autoSave(projectId, pages, settings);

// Load auto-save
const autoSaved = await persistenceService.loadAutoSave();
```

## Component System

### Component Architecture

Each component follows a standard structure:

```typescript
interface ComponentData {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  props: Record<string, any>;
  style: Record<string, any>;
  bindings?: Record<string, string>;
  events?: Record<string, string>;
  customCSS?: string;
  customJS?: string;
  customHTML?: string;
}
```

### Available Components

#### Basic Components
- **Button** - Interactive buttons with variants, sizes, and loading states
- **Text** - Rich text display with formatting options
- **Image** - Image component with fit modes and effects

#### Form Components
- **Input** - Text input with validation
- **Select** - Dropdown selection (single/multiple)
- **Checkbox** - Boolean input
- **DatePicker** - Date selection with calendar UI
- **Form** - Complete form with validation and submission

#### Data Components
- **Table** - Advanced data table with sorting, filtering, pagination, and row selection

#### Layout Components
- **Modal** - Overlay modals with configurable sizes
- **Tabs** - Tabbed navigation with multiple variants
- **Container** - Layout container for grouping

#### Advanced Components
- **Custom Function** - Execute custom HTML, CSS, and JavaScript

### Property Schema System

Each component defines its properties using a schema:

```typescript
interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'code' | 'expression' | 'json' | 'action';
  options?: string[];
  defaultValue?: any;
  category?: 'General' | 'Style' | 'Events' | 'Data' | 'Advanced';
  helperText?: string;
  visibleIf?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}
```

## Bindings & Data Flow

### Binding Syntax

Use `{{ }}` to create dynamic bindings:

```typescript
// Reference widget properties
{{ widgets.input1.value }}

// Call utility functions
{{ utils.formatDate(widgets.datepicker1.value, 'long') }}

// Complex expressions
{{ widgets.table1.selectedRows.length > 0 ? 'Delete Selected' : 'Select Rows' }}

// Access action results
{{ actions.fetchUsers.data }}
```

### Evaluation Context

The expression engine provides access to:

- `widgets` - All widget instances and their current state
- `actions` - Action definitions and results
- `page` - Current page metadata
- `utils` - Utility function library
- `store` - Global application state

### Reactive Updates

The system automatically tracks dependencies and re-evaluates bindings when:
- Widget properties change
- Action results update
- Global state changes
- Page navigation occurs

## State Management

### Zustand Store (`src/store/useAppStore.ts`)

Central state management using Zustand:

```typescript
const useAppStore = create<AppState>((set, get) => ({
  // State
  components: [],
  selectedComponent: null,
  pages: [],

  // Actions
  addComponent: (component) => set(state => ({
    components: [...state.components, component]
  })),

  updateComponent: (id, updates) => set(state => ({
    components: state.components.map(c =>
      c.id === id ? { ...c, ...updates } : c
    )
  }))
}));
```

### Global State

Application-wide state accessible from bindings:

```typescript
// Set global state
updateGlobalState('currentUser', userData);

// Access in bindings
{{ store.currentUser.name }}
```

## Events & Actions

### Event Configuration

Components can define event handlers:

```typescript
{
  type: 'button',
  props: {
    onClick: '{{ actions.saveUser.run({ payload: widgets.form1.values }) }}'
  }
}
```

### Action Chaining

Run multiple actions in sequence:

```typescript
await actionManager.runActionChain([
  'validateForm',
  'saveUser',
  'showSuccess',
  'navigate'
], params);
```

### Event Listeners

Subscribe to action results:

```typescript
actionManager.addListener('saveUser', (result) => {
  if (result.success) {
    toast.success('User saved!');
  } else {
    toast.error(result.error);
  }
});
```

## Security

### Expression Sandboxing

The expression engine blocks access to:
- `eval`, `Function` constructors
- `window`, `document`, `global` objects
- `process`, `require`, `import` statements
- Network APIs (`fetch`, `XMLHttpRequest`)

### Safe Evaluation

All expressions are evaluated in a controlled scope:

```typescript
const fn = new Function(
  'widgets',
  'actions',
  'page',
  'utils',
  'store',
  `return (${expression});`
);

const result = fn(context.widgets, context.actions, context.page, context.utils, context.store);
```

## Performance

### Optimization Strategies

1. **Expression Caching** - Results are cached until dependencies change
2. **Selective Re-rendering** - Only affected components update
3. **Virtual Scrolling** - Large tables use windowing
4. **Debounced Updates** - Rapid changes are batched
5. **Lazy Loading** - Heavy components load on demand

### Performance Tips

- Use bindings sparingly in loops
- Cache computed values in global state
- Minimize expression complexity
- Use action result caching
- Enable virtualization for large datasets

## Testing

### Expression Testing

```typescript
const result = expressionEngine.validateExpression('{{ widgets.input1.value }}');
if (!result.valid) {
  console.error('Invalid expression:', result.error);
}
```

### Action Testing

```typescript
const mockData = [{ id: 1, name: 'Test' }];
actionManager.registerAction({
  id: 'testAction',
  type: 'runJS',
  config: {
    code: 'return mockData'
  }
});

const result = await actionManager.run('testAction');
expect(result.success).toBe(true);
```

## Extensibility

### Custom Components

Add new components by:

1. Creating the component implementation
2. Defining the property schema
3. Adding to component definitions
4. Registering in RenderComponent

```typescript
// 1. Create component
export const MyCustomComponent: React.FC<ComponentProps> = ({ component }) => {
  return <div>{component.props.customProp}</div>;
};

// 2. Define schema
{
  type: 'mycustom',
  name: 'My Custom',
  category: 'custom',
  propertySchema: [
    { key: 'customProp', label: 'Custom Property', type: 'text' }
  ]
}

// 3. Register in RenderComponent
case 'mycustom':
  return <MyCustomComponent {...props} />;
```

### Custom Actions

Extend action types:

```typescript
class CustomActionManager extends ActionManager {
  async executeCustomAction(action, params) {
    // Custom implementation
  }
}
```

### Custom Utils

Add utility functions:

```typescript
expressionEngine['context'].utils.myCustomUtil = (input) => {
  // Custom logic
  return result;
};
```

## Database Schema (Supabase)

### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB,
  pages TEXT[],
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Pages Table

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  route TEXT,
  is_home_page BOOLEAN DEFAULT false,
  components JSONB,
  apis JSONB,
  queries JSONB,
  seo JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Best Practices

### Component Design
- Keep components focused on single responsibility
- Use clear, descriptive property names
- Provide sensible defaults
- Document expected data shapes

### Binding Design
- Avoid complex expressions in loops
- Use descriptive variable names
- Cache expensive computations
- Handle null/undefined values

### Action Design
- Provide clear success/error messages
- Use appropriate timeouts
- Handle edge cases gracefully
- Log errors for debugging

### Performance
- Enable virtualization for large datasets
- Debounce rapid user input
- Use pagination for data tables
- Minimize component nesting depth

## Migration Guide

### From v1 to v2

1. Update component types to include new components
2. Migrate old bindings to new expression syntax
3. Update action configurations to new format
4. Test all existing pages in preview mode

## Troubleshooting

### Common Issues

**Expressions not evaluating:**
- Check syntax with `validateExpression()`
- Verify context has required data
- Check console for evaluation errors

**Actions failing:**
- Verify action registration
- Check network connectivity
- Review action configuration
- Check console for error messages

**Components not rendering:**
- Verify component type is registered
- Check component props are valid
- Review console for React errors

## Future Enhancements

- Visual workflow builder for action chains
- Component marketplace for sharing custom components
- AI-powered component suggestions
- Real-time collaboration features
- Mobile app builder
- Advanced charting components
- Integration with popular APIs
- Plugin system for third-party extensions
