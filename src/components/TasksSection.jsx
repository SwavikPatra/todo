// components/TasksSection.jsx
import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Trash2 } from 'lucide-react';

const TasksSection = ({
  currentData,
  updateCurrentData,
  selectedDate,
  formatDate,
  darkMode,
  cardClasses,
  layoutMode
}) => {
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState('');

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' 
    : 'bg-white border-gray-200 focus:border-indigo-500';

  const addTodo = () => {
    if (newTodo.trim()) {
      updateCurrentData({
        todos: [...currentData.todos, {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
          priority: 'medium'
        }]
      });
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    updateCurrentData({
      todos: currentData.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const deleteTodo = (id) => {
    updateCurrentData({
      todos: currentData.todos.filter(todo => todo.id !== id)
    });
  };

  const updateTodo = (id, newText) => {
    updateCurrentData({
      todos: currentData.todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    });
    setEditingTodo(null);
  };

  return (
    <div className={`${layoutMode === 'stacked' ? cardClasses + ' rounded-2xl shadow-xl' : ''} p-6`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <CheckSquare className="w-5 h-5 text-indigo-600" />
        Tasks for {formatDate(selectedDate)}
      </h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${inputClasses}`}
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {currentData.todos.length === 0 ? (
          <p className={`text-center py-8 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No tasks yet. Add one above!
          </p>
        ) : (
          currentData.todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                todo.completed
                  ? darkMode 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-green-50 border-green-200'
                  : darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:border-indigo-400' 
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : darkMode
                      ? 'border-gray-500 hover:border-indigo-400'
                      : 'border-gray-300 hover:border-indigo-500'
                }`}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>
              
              {editingTodo === todo.id ? (
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => updateTodo(todo.id, e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingTodo(null)}
                  onBlur={() => setEditingTodo(null)}
                  className={`flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500 ${inputClasses}`}
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 cursor-text ${
                    todo.completed 
                      ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-500'}` 
                      : darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}
                  onDoubleClick={() => setEditingTodo(todo.id)}
                >
                  {todo.text}
                </span>
              )}
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className={`p-1 text-red-500 rounded transition-colors ${
                  darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {currentData.todos.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl ${
          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              darkMode ? 'text-indigo-300' : 'text-indigo-800'
            }`}>Progress</span>
            <span className={`text-sm ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              {currentData.todos.filter(t => t.completed).length} of {currentData.todos.length} completed
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            darkMode ? 'bg-gray-700' : 'bg-indigo-200'
          }`}>
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentData.todos.filter(t => t.completed).length / currentData.todos.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksSection;