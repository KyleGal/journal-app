import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import MorningJournal from './components/MorningJournal'
import EveningJournal from './components/EveningJournal'
import JournalHistory from './components/JournalHistory'
import TitleBar from './components/TitleBar'
import type { JournalEntry } from './types/electron'
import { Sunrise, BookOpen } from 'lucide-react'
import { formatDate } from './lib/utils'

function App() {
  const [activeTab, setActiveTab] = useState('journal')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await window.journalAPI.getEntries()
      setEntries(data.entries || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    }
  }

  const handleSaveEntry = async (entry: JournalEntry) => {
    try {
      const result = await window.journalAPI.saveEntry(entry)
      if (result.success) {
        await loadEntries()
        setSelectedEntry(null)
      }
    } catch (error) {
      console.error('Error saving entry:', error)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const result = await window.journalAPI.deleteEntry(entryId)
      if (result.success) {
        await loadEntries()
        setSelectedEntry(null)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setActiveTab(entry.type)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <TitleBar />
      <div className="flex-1 overflow-y-auto px-10 mt-10 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             <header className="mb-8 relative">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Daily Journal
                </h1>
                <p className="text-muted-foreground">Reflect on your day, plan for tomorrow</p>
              </div>

              <div className="absolute right-0 top-0">
                <TabsList className="grid grid-cols-1">
                <TabsTrigger value="journal" className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4" />
                  Journal
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>
              </div>
            </header>
            
            <div className="mb-4 text-lg font-medium">{formatDate(new Date().toISOString().split('T')[0])}</div>
            <TabsContent value="journal" className="grid grid-cols-2 gap-6 w-full items-start">
              <MorningJournal
                onSave={handleSaveEntry}
                existingEntry={selectedEntry?.type === 'morning' ? selectedEntry : undefined}
                onClear={() => setSelectedEntry(null)}
              />
              <EveningJournal
                onSave={handleSaveEntry}
                existingEntry={selectedEntry?.type === 'evening' ? selectedEntry : undefined}
                onClear={() => setSelectedEntry(null)}
              />
            </TabsContent>

            <TabsContent value="history">
              <JournalHistory
                entries={entries}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            </TabsContent>
          </Tabs>
      </div>
    </div>
    
  )
}

export default App
