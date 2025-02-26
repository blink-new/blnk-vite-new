import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Star, Trash2, ChevronDown, Calendar, AlertTriangle, Edit2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { Todo } from '../types'

interface TaskItemProps {
  todo: Todo
  onToggleComplete: (id: string) => void
  onToggleImportant: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function TaskItem({ todo, onToggleComplete, onToggleImportant, onDelete, onUpdate }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (editText.trim() !== '') {
      onUpdate(todo.id, { text: editText.trim() })
      setIsEditing(false)
    }
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all",
        todo.completed && "opacity-75"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
            todo.completed 
              ? "bg-indigo-600 border-indigo-600" 
              : "border-gray-300 hover:border-indigo-500"
          )}
        >
          {todo.completed && (
            <Check className="w-4 h-4 text-white" />
          )}
        </button>
        
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          ) : (
            <div 
              className={cn(
                "text-gray-800 dark:text-gray-200",
                todo.completed && "line-through text-gray-500"
              )}
            >
              {todo.text}
            </div>
          )}
          
          <div className="flex gap-2 items-center mt-1">
            {todo.dueDate && (
              <span className={cn(
                "inline-flex items-center text-xs gap-1",
                isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              )}>
                <Calendar className="w-3 h-3" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
            
            <span className={cn(
              "inline-flex items-center text-xs px-2 py-0.5 rounded",
              priorityColors[todo.priority]
            )}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {todo.priority}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {todo.category}
            </span>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleImportant(todo.id)}
            className={cn(
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
              todo.important ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"
            )}
          >
            <Star className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <ChevronDown className={cn(
              "w-5 h-5 transition-transform",
              isExpanded && "transform rotate-180"
            )} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && todo.notes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {todo.notes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}