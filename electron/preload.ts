import { contextBridge, ipcRenderer } from 'electron';

export interface JournalEntry {
  id: string;
  date: string;
  type: 'morning' | 'evening';
  content: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JournalAPI {
  getEntries: () => Promise<{ entries: JournalEntry[] }>;
  saveEntry: (entry: JournalEntry) => Promise<{ success: boolean; error?: string }>;
  deleteEntry: (entryId: string) => Promise<{ success: boolean; error?: string }>;
}

contextBridge.exposeInMainWorld('journalAPI', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  saveEntry: (entry: JournalEntry) => ipcRenderer.invoke('save-entry', entry),
  deleteEntry: (entryId: string) => ipcRenderer.invoke('delete-entry', entryId),
} as JournalAPI);
