import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, X, Check, Star, Trash2 } from 'lucide-react'
import { cn } from './lib/utils'

interface Todo {
  id: string
  text: string
  completed: boolean
  important: boolean
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    setTodos(prev => [...prev, {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      important: false
    }])
    setNewTodo('')
    setIsAdding(false)
  }

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setTodos(items)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-950 dark:text-white mb-8">
          My Tasks
        </h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                <AnimatePresence>
                  {todos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all",
                            todo.completed && "opacity-75"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleComplete(todo.id)}
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
                            
                            <span className={cn(
                              "flex-1 text-gray-800 dark:text-gray-200",
                              todo.completed && "line-through text-gray-500"
                            )}>
                              {todo.text}
                            </span>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toggleImportant(todo.id)}
                                className={cn(
                                  "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                                  todo.important && "text-yellow-500"
                                )}
                              >
                                <Star className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AnimatePresence>
          {isAdding ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onSubmit={addTodo}
              className="mt-4"
            >
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setIsAdding(true)}
              className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add new task</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}