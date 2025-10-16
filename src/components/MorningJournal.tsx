import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import type { JournalEntry } from '../types/electron'
import { getGreeting } from '../lib/utils'
import { Save, RefreshCw } from 'lucide-react'

interface MorningJournalProps {
  onSave: (entry: JournalEntry) => void
  existingEntry?: JournalEntry
  onClear: () => void
}

const morningPrompts = [
  {
    id: 'gratitude',
    label: 'What are you grateful for today?',
    placeholder: 'List 3 things you\'re grateful for...',
  },
  {
    id: 'intention',
    label: 'What is your intention for today?',
    placeholder: 'What do you want to focus on or achieve today?',
  },
  {
    id: 'goals',
    label: 'What are your top 3 priorities today?',
    placeholder: '1.\n2.\n3.',
  },
  {
    id: 'affirmation',
    label: 'Write a positive affirmation',
    placeholder: 'I am...',
  },
]

export default function MorningJournal({ onSave, existingEntry, onClear }: MorningJournalProps) {
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
      id: existingEntry?.id || `morning-${timestamp}`,
      date: existingEntry?.date || today,
      type: 'morning',
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
      <Card className="border-amber-200 dark:border-amber-900 flex-1">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            {getGreeting()}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {morningPrompts.map((prompt) => (
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
