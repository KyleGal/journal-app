import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { JournalEntry } from '../types/electron'
import { formatDate } from '../lib/utils'
import { Edit, Trash2, Sunrise, Sunset, ChevronRight } from 'lucide-react'

interface JournalHistoryProps {
  entries: JournalEntry[]
  onEdit: (entry: JournalEntry) => void
  onDelete: (entryId: string) => void
}

export default function JournalHistory({ entries, onEdit, onDelete }: JournalHistoryProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const sortedEntries = [...entries].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (dateCompare !== 0) return dateCompare
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const toggleExpand = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId)
  }

  const handleDelete = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      onDelete(entryId)
    }
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No journal entries yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Start by creating a morning or evening entry!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => {
        const isExpanded = expandedEntry === entry.id
        const Icon = entry.type === 'morning' ? Sunrise : Sunset

        return (
          <Card
            key={entry.id}
            className={'cursor-pointer transition-all ' + (entry.type === 'morning' ? 'border-amber-200 dark:border-amber-900' : 'border-indigo-200 dark:border-indigo-900')}
          >
            <CardHeader
              onClick={() => toggleExpand(entry.id)}
              className="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                  <CardTitle className="text-lg">
                    {entry.type === 'morning' ? 'Morning Journal' : 'Evening Reflection'}
                  </CardTitle>
                  <CardDescription>{formatDate(entry.date)}</CardDescription>
                </div>
              </div>
              <ChevronRight
                className={'w-5 h-5 transition-transform ' + (isExpanded ? 'rotate-90' : '')}
              />
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4">
                {Object.entries(entry.content).map(([key, value]) => {
                  if (!value || value.trim() === '') return null
                  return (
                    <div key={key} className="space-y-1">
                      <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim().replace(/$/g, '$')}:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{value}</p>
                    </div>
                  )
                })}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
