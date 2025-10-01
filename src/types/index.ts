export interface ComponentData {
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

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  defaultStyle: Record<string, any>;
  defaultSize: { width: number; height: number };
  category: ComponentCategory;
  propertySchema: PropertySchema[];
}

export interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'code' | 'url' | 'regex' | 'expression' | 'json' | 'action';
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

export type ComponentType =
  | 'button'
  | 'input'
  | 'text'
  | 'image'
  | 'table'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'datepicker'
  | 'fileupload'
  | 'chart'
  | 'list'
  | 'container'
  | 'modal'
  | 'tabs'
  | 'form'
  | 'customfunction';

export type ComponentCategory = 'basic' | 'form' | 'data' | 'layout' | 'advanced' | 'custom';

export interface ButtonProps {
  label: string;
  tooltip?: string;
  visible: boolean;
  disabled: boolean;
  loading: boolean;
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  recaptcha?: {
    enabled: boolean;
    siteKey: string;
    version: 'v2' | 'v3';
  };
  form?: {
    disableWhenInvalid: boolean;
    resetOnSuccess: boolean;
  };
  actions: {
    onClick: ActionConfig;
  };
}

export interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  visible: boolean;
  validation: {
    regex?: string;
    minLength?: number;
    maxLength?: number;
    customFunction?: string;
    errorMessage?: string;
  };
  prefix?: string;
  suffix?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export interface TextProps {
  content: string;
  richText: boolean;
  fontSize: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  visible: boolean;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ImageProps {
  src: string;
  alt: string;
  fit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  clickAction: ActionConfig;
  visible: boolean;
  borderRadius?: string;
  opacity?: number;
  grayscale?: boolean;
  blur?: number;
}

export interface TableProps {
  columns: TableColumn[];
  dataSource: 'static' | 'api' | 'query';
  data: any[];
  apiEndpoint?: string;
  queryId?: string;
  pagination: {
    enabled: boolean;
    pageSize: number;
    showPageSizeOptions: boolean;
    pageSizeOptions: number[];
  };
  sorting: {
    enabled: boolean;
    defaultSort?: string;
    defaultOrder?: 'asc' | 'desc';
  };
  filtering: {
    enabled: boolean;
    searchPlaceholder?: string;
  };
  selection: {
    mode: 'none' | 'single' | 'multiple';
    showSelectAll?: boolean;
  };
  rowActions: ActionConfig[];
  visible: boolean;
  compact?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

export interface TableColumn {
  key: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'link' | 'badge' | 'progress';
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: string;
  color?: string;
}

export interface SelectProps {
  label: string;
  placeholder: string;
  value: string | string[];
  options: SelectOption[];
  multiple: boolean;
  searchable: boolean;
  clearable: boolean;
  disabled: boolean;
  required: boolean;
  visible: boolean;
  loading: boolean;
  maxHeight?: number;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  color?: string;
  icon?: string;
}

export interface CheckboxProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  required: boolean;
  visible: boolean;
  indeterminate?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface CustomFunctionProps {
  html: string;
  css: string;
  javascript: string;
  props: Record<string, any>;
  visible: boolean;
  height?: number;
}

export interface ActionConfig {
  type: 'query' | 'js' | 'modal' | 'navigate' | 'alert' | 'download' | 'copy' | 'none';
  target?: string;
  params?: Record<string, any>;
  confirmation?: {
    enabled: boolean;
    title?: string;
    message?: string;
  };
  successMessage?: string;
  errorMessage?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
  params?: Record<string, string>;
  authentication?: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  response?: any;
  isLoading?: boolean;
  error?: string;
  timeout?: number;
  retries?: number;
}

export interface SqlQuery {
  id: string;
  name: string;
  query: string;
  datasource: string;
  result?: any[];
  isLoading?: boolean;
  error?: string;
  parameters?: Record<string, any>;
  timeout?: number;
  limit?: number;
}

export interface Datasource {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'rest-api' | 'graphql' | 'firebase' | 'supabase';
  config: {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    url?: string;
    ssl?: boolean;
    apiKey?: string;
    projectId?: string;
  };
  isConnected?: boolean;
  lastTested?: Date;
}

export interface AppPage {
  id: string;
  name: string;
  components: ComponentData[];
  apis: string[];
  queries: string[];
  route?: string;
  isHomePage?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface GlobalState {
  [key: string]: any;
}

export interface CodeGeneration {
  html: string;
  css: string;
  javascript: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface AppSettings {
  theme: Theme;
  responsive: boolean;
  rtl: boolean;
  animations: boolean;
  debugMode: boolean;
}

export interface PropMeta {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'expression' | 'color' | 'json' | 'action';
  default?: any;
  category?: 'General' | 'Style' | 'Events' | 'Data';
  helperText?: string;
  visibleIf?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    custom?: string;
  };
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: 'add' | 'update' | 'delete' | 'move' | 'resize';
  componentId?: string;
  before?: any;
  after?: any;
}