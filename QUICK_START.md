# Quick Start Guide

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Basic Workflow

### 1. Building Your First Page

1. **Add Components:**
   - Open the component library (left panel)
   - Drag and drop components onto the canvas
   - Position and resize as needed

2. **Configure Properties:**
   - Select a component
   - Edit properties in the right panel (Properties tab)
   - Apply styles in the Style tab

3. **Add Bindings:**
   - Use `{{ }}` syntax to create dynamic properties
   - Reference other widgets: `{{ widgets.input1.value }}`
   - Use utility functions: `{{ utils.formatDate(new Date()) }}`

4. **Preview Your Page:**
   - Click the Preview button in the top bar
   - Test interactions and bindings

### 2. Using Bindings

**Simple Property Binding:**
```javascript
// Button text from input
{{ widgets.nameInput.value }}
```

**Conditional Binding:**
```javascript
// Show/hide based on checkbox
{{ widgets.agreeCheckbox.checked ? 'Agreed' : 'Not Agreed' }}
```

**Array Operations:**
```javascript
// Count selected rows
{{ widgets.usersTable.selectedRows.length }} selected
```

**Formatting:**
```javascript
// Format currency
{{ utils.formatCurrency(widgets.priceInput.value) }}
```

### 3. Creating Actions

**HTTP Request Example:**

1. Go to APIs panel (left panel)
2. Create new API endpoint:
   - Name: `fetchUsers`
   - Method: `GET`
   - URL: `https://jsonplaceholder.typicode.com/users`
3. Click "Run" to test
4. Bind to table: `{{ actions.fetchUsers.data }}`

**Button Click Action:**

1. Select button component
2. In properties, set onClick:
```javascript
{{ actions.fetchUsers.run() }}
```

### 4. Working with Forms

**Create a Form:**

1. Drag Form component to canvas
2. Configure fields in properties:
```json
[
  {
    "name": "email",
    "label": "Email",
    "type": "email",
    "required": true
  },
  {
    "name": "message",
    "label": "Message",
    "type": "textarea",
    "required": true
  }
]
```

3. Set onSubmit action
4. Bind form data: `{{ widgets.contactForm.values }}`

### 5. Building a Data Table

**Setup:**

1. Add Table component
2. Configure columns in properties
3. Bind data source:
   - From API: `{{ actions.fetchUsers.data }}`
   - Static: Define in data property

**Enable Features:**
- Sorting: Enable in properties
- Filtering: Enable search
- Pagination: Set page size
- Selection: Enable row selection

**Access Selected Rows:**
```javascript
{{ widgets.usersTable.selectedRows }}
```

## Common Patterns

### Master-Detail View

```javascript
// Table in master view
widgets.productsTable

// Detail panel shows selected item
{{ widgets.productsTable.selectedRows[0] }}
```

### Conditional Visibility

```javascript
// Component visible property
{{ widgets.statusSelect.value === 'active' }}
```

### Form Validation

```javascript
// Button disabled when form invalid
{{ !widgets.loginForm.isValid }}
```

### Loading States

```javascript
// Button loading during API call
{{ actions.saveUser.isLoading }}
```

## Tips & Tricks

### Performance

- Cache expensive computations in global state
- Use pagination for large datasets
- Enable table virtualization
- Minimize binding complexity

### Debugging

- Open browser console for error messages
- Use Preview mode to test bindings
- Check Network tab for API calls
- Validate expressions before use

### Best Practices

1. **Naming Conventions:**
   - Use descriptive component IDs
   - Prefix by type: `btnSubmit`, `inputEmail`

2. **Organization:**
   - Group related components
   - Use consistent spacing
   - Align components to grid

3. **Reusability:**
   - Create reusable action definitions
   - Store common values in global state
   - Use utility functions for repeated logic

## Example Applications

### Todo List

**Components:**
- Input: `todoInput`
- Button: `btnAdd`
- Table: `todoTable`

**Actions:**
```javascript
// Add todo
actions.addTodo.run({
  text: widgets.todoInput.value,
  completed: false
})

// Toggle complete
actions.toggleTodo.run({
  id: currentRow.id
})
```

### User Dashboard

**Layout:**
- Header with navigation
- Sidebar with filters
- Main content with data table
- Detail modal

**Data Flow:**
1. Load users on page load
2. Filter using sidebar inputs
3. Display in table
4. Show details in modal on row click

### Contact Form

**Components:**
- Form with validation
- Submit button with loading
- Success message (conditional)

**Flow:**
1. User fills form
2. Validation on submit
3. API call to save
4. Show success/error message
5. Reset form on success

## Getting Help

- Check ARCHITECTURE.md for detailed documentation
- Review component schemas in ComponentLibrary.tsx
- Explore example implementations in src/components/ui/
- Test expressions in browser console

## Next Steps

1. Explore all available components
2. Create your first page
3. Connect to real APIs
4. Implement complex workflows
5. Deploy your application

Happy building!
