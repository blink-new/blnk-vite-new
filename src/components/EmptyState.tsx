import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="inline-block p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4"
      >
        <ClipboardList className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No tasks yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Start by adding your first task
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
      >
        Add your first task
      </button>
    </motion.div>
  )
}