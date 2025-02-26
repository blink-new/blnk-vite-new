import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Search, Filter } from 'lucide-react'
import { cn } from './lib/utils'
import { EmptyState } from './components/EmptyState'
import { TaskStats } from './components/TaskStats'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import type { Todo, TodoStats } from './types'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsAddingTask(true)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const addTodo = (todoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    setTodos(prev => [...prev, {
      ...todoData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    }])
  }

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? {
        ...todo,
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : undefined
      } : todo
    ))
  }

  const toggleImportant = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, important: !todo.important } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo,
        ...updates
      } : todo
    ))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setTodos(items)
  }

  const filteredTodos = todos
    .filter(todo => showCompleted || !todo.completed)
    .filter(todo => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(todo => categoryFilter === 'all' || todo.category === categoryFilter)
    .filter(todo => priorityFilter === 'all' || todo.priority === priorityFilter)

  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      !t.completed
    ).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-950 dark:text-white">
            My Tasks
          </h1>
          <button
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="text-xs opacity-70 ml-1">(⌘N)</span>
          </button>
        </motion.div>

        <TaskStats stats={stats} />

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="inbox">📥 Inbox</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="health">❤️ Health</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>

              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-colors",
                  showCompleted
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {showCompleted ? "Hide" : "Show"} Completed
              </button>
            </div>
          </div>
        </div>

        <TaskForm
          open={isAddingTask}
          onOpenChange={setIsAddingTask}
          onSubmit={addTodo}
        />

        {todos.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddingTask(true)} />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <AnimatePresence>
                    {filteredTodos.map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskItem
                              todo={todo}
                              onToggleComplete={toggleComplete}
                              onToggleImportant={toggleImportant}
                              onDelete={deleteTodo}
                              onUpdate={updateTodo}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}