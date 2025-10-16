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

declare global {
  interface Window {
    journalAPI: JournalAPI;
  }
}
