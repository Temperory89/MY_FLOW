import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SavedPage {
  id: string;
  name: string;
  route?: string;
  is_home_page: boolean;
  components: any[];
  apis: string[];
  queries: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  pages: string[];
  settings: any;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}
