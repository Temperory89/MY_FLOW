import { ComponentData } from '../types';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: 'add' | 'update' | 'delete' | 'move' | 'resize';
  componentId?: string;
  before?: any;
  after?: any;
}

export class HistoryManager {
  private history: HistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    this.history = this.history.slice(0, this.currentIndex + 1);

    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.history.push(newEntry);

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  undo(): HistoryEntry | null {
    if (!this.canUndo()) {
      return null;
    }

    const entry = this.history[this.currentIndex];
    this.currentIndex--;
    return entry;
  }

  redo(): HistoryEntry | null {
    if (!this.canRedo()) {
      return null;
    }

    this.currentIndex++;
    const entry = this.history[this.currentIndex];
    return entry;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  recordComponentAdd(component: ComponentData): void {
    this.addEntry({
      action: 'add',
      componentId: component.id,
      after: component
    });
  }

  recordComponentUpdate(componentId: string, before: any, after: any): void {
    this.addEntry({
      action: 'update',
      componentId,
      before,
      after
    });
  }

  recordComponentDelete(component: ComponentData): void {
    this.addEntry({
      action: 'delete',
      componentId: component.id,
      before: component
    });
  }

  recordComponentMove(componentId: string, beforePos: { x: number; y: number }, afterPos: { x: number; y: number }): void {
    this.addEntry({
      action: 'move',
      componentId,
      before: beforePos,
      after: afterPos
    });
  }

  recordComponentResize(
    componentId: string,
    beforeSize: { width: number; height: number },
    afterSize: { width: number; height: number }
  ): void {
    this.addEntry({
      action: 'resize',
      componentId,
      before: beforeSize,
      after: afterSize
    });
  }
}

export const historyManager = new HistoryManager();
