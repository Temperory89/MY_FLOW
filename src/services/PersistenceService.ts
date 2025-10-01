import { supabase, SavedPage, SavedProject } from './supabaseClient';
import { AppPage, ComponentData, AppSettings } from '../types';

export class PersistenceService {
  async createMigration() {
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    const hasProjectsTable = tables?.some(t => t.table_name === 'projects');
    const hasPagesTable = tables?.some(t => t.table_name === 'pages');

    if (!hasProjectsTable || !hasPagesTable) {
      console.log('Creating database tables...');
    }
  }

  async saveProject(
    name: string,
    description: string,
    pages: AppPage[],
    settings: AppSettings
  ): Promise<{ success: boolean; projectId?: string; error?: string }> {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          settings: JSON.stringify(settings),
          pages: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (projectError || !project) {
        return { success: false, error: projectError?.message || 'Failed to create project' };
      }

      const pageIds: string[] = [];

      for (const page of pages) {
        const { data: savedPage, error: pageError } = await supabase
          .from('pages')
          .insert({
            name: page.name,
            route: page.route,
            is_home_page: page.isHomePage || false,
            components: JSON.stringify(page.components),
            apis: JSON.stringify(page.apis),
            queries: JSON.stringify(page.queries),
            seo: JSON.stringify(page.seo || {}),
            project_id: project.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .maybeSingle();

        if (pageError || !savedPage) {
          console.error('Failed to save page:', page.name, pageError);
          continue;
        }

        pageIds.push(savedPage.id);
      }

      await supabase
        .from('projects')
        .update({ pages: pageIds })
        .eq('id', project.id);

      return { success: true, projectId: project.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateProject(
    projectId: string,
    name?: string,
    description?: string,
    pages?: AppPage[],
    settings?: AppSettings
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (settings !== undefined) updates.settings = JSON.stringify(settings);

      const { error: projectError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (projectError) {
        return { success: false, error: projectError.message };
      }

      if (pages) {
        for (const page of pages) {
          await this.savePage(projectId, page);
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async loadProject(
    projectId: string
  ): Promise<{ success: boolean; project?: any; pages?: AppPage[]; error?: string }> {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError || !project) {
        return { success: false, error: projectError?.message || 'Project not found' };
      }

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('project_id', projectId);

      if (pagesError) {
        return { success: false, error: pagesError.message };
      }

      const pages: AppPage[] = (pagesData || []).map((page: any) => ({
        id: page.id,
        name: page.name,
        route: page.route,
        isHomePage: page.is_home_page,
        components: JSON.parse(page.components || '[]'),
        apis: JSON.parse(page.apis || '[]'),
        queries: JSON.parse(page.queries || '[]'),
        seo: JSON.parse(page.seo || '{}')
      }));

      return {
        success: true,
        project: {
          ...project,
          settings: JSON.parse(project.settings || '{}')
        },
        pages
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listProjects(): Promise<{ success: boolean; projects?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, projects: data || [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await supabase.from('pages').delete().eq('project_id', projectId);

      const { error } = await supabase.from('projects').delete().eq('id', projectId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async savePage(projectId: string, page: AppPage): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('pages').upsert({
        id: page.id,
        name: page.name,
        route: page.route,
        is_home_page: page.isHomePage || false,
        components: JSON.stringify(page.components),
        apis: JSON.stringify(page.apis),
        queries: JSON.stringify(page.queries),
        seo: JSON.stringify(page.seo || {}),
        project_id: projectId,
        updated_at: new Date().toISOString()
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async saveToLocalStorage(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  async loadFromLocalStorage(key: string): Promise<any | null> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  async autoSave(
    projectId: string | null,
    pages: AppPage[],
    settings: AppSettings
  ): Promise<void> {
    const autoSaveData = {
      projectId,
      pages,
      settings,
      timestamp: new Date().toISOString()
    };

    await this.saveToLocalStorage('appbuilder_autosave', autoSaveData);
  }

  async loadAutoSave(): Promise<any | null> {
    return await this.loadFromLocalStorage('appbuilder_autosave');
  }

  async clearAutoSave(): Promise<void> {
    localStorage.removeItem('appbuilder_autosave');
  }
}

export const persistenceService = new PersistenceService();
