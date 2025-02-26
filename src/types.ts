export interface Todo {
  id: string
  text: string
  completed: boolean
  important: boolean
  dueDate?: string
  notes?: string
  category: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  completedAt?: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
}