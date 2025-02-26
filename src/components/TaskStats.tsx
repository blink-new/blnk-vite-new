import { motion } from 'framer-motion'
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react'
import type { TodoStats } from '../types'

interface TaskStatsProps {
  stats: TodoStats
}

export function TaskStats({ stats }: TaskStatsProps) {
  const items = [
    {
      label: 'Total',
      value: stats.total,
      icon: ListTodo,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className={`inline-flex p-2 rounded-lg ${item.color} mb-3`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="font-semibold text-2xl text-gray-900 dark:text-gray-100 mb-1">
            {item.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}