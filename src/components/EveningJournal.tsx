import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import type { JournalEntry } from '../types/electron'
import { Save, RefreshCw } from 'lucide-react'

interface EveningJournalProps {
  onSave: (entry: JournalEntry) => void
  existingEntry?: JournalEntry
  onClear: () => void
}

const eveningPrompts = [
  {
    id: 'highlights',
    label: 'What were the highlights of your day?',
    placeholder: 'Describe the best moments of your day...',
  },
  {
    id: 'challenges',
    label: 'What challenges did you face?',
    placeholder: 'What difficulties did you encounter and how did you handle them?',
  },
  {
    id: 'learnings',
    label: 'What did you learn today?',
    placeholder: 'Any insights, lessons, or realizations?',
  },
  {
    id: 'accomplishments',
    label: 'What did you accomplish today?',
    placeholder: 'List what you completed or made progress on...',
  },
  {
    id: 'improvements',
    label: 'What could you improve tomorrow?',
    placeholder: 'What would you do differently?',
  },
]

export default function EveningJournal({ onSave, existingEntry, onClear }: EveningJournalProps) {
  const [responses, setResponses] = useState<{ [key: string]: string }>({})
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (existingEntry) {
      setResponses(existingEntry.content)
    } else {
      setResponses({})
    }
  }, [existingEntry])

  const handleChange = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = () => {
    const timestamp = Date.now()
    const entry: JournalEntry = {
      id: existingEntry?.id || `evening-${timestamp}`,
      date: existingEntry?.date || today,
      type: 'evening',
      content: responses,
      createdAt: existingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(entry)
    setResponses({})
  }

  const handleClear = () => {
    setResponses({})
    onClear()
  }

  const isFilled = Object.values(responses).some((value) => value.trim() !== '')

  return (
    <div className="space-y-5 flex flex-col h-full">
      <Card className="border-indigo-200 dark:border-indigo-900 flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Evening Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {eveningPrompts.map((prompt) => (
            <div key={prompt.id} className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {prompt.label}
              </label>
              <Textarea
                placeholder={prompt.placeholder}
                value={responses[prompt.id] || ''}
                onChange={(e) => handleChange(prompt.id, e.target.value)}
                className="min-h-[80px] resize-y"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleClear} disabled={!isFilled}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={handleSave} disabled={!isFilled}>
          <Save className="w-4 h-4 mr-2" />
          Save Entry
        </Button>
      </div>
    </div>
  )
}
