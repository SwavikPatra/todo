import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, X, Edit3, Save, Trash2, StickyNote, CheckSquare, Tag } from 'lucide-react';

const NoteTakingApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState('');

  // Initialize data structure for a date
  const initDateData = (date) => ({
    notes: '',
    todos: [],
    tags: [],
    mood: '',
    priority: 'medium'
  });

  // Get data for current date
  const getCurrentData = () => {
    return data[selectedDate] || initDateData(selectedDate);
  };

  // Update data for current date
  const updateCurrentData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDate]: {
        ...getCurrentData(),
        ...updates
      }
    }));
  };

  // Get all dates with data, sorted
  const getDatesWithData = () => {
    return Object.keys(data)
      .filter(date => data[date].notes || data[date].todos.length > 0)
      .sort((a, b) => new Date(b) - new Date(a));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  // Add new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      const currentData = getCurrentData();
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

  // Toggle todo completion
  const toggleTodo = (id) => {
    const currentData = getCurrentData();
    updateCurrentData({
      todos: currentData.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  // Delete todo
  const deleteTodo = (id) => {
    const currentData = getCurrentData();
    updateCurrentData({
      todos: currentData.todos.filter(todo => todo.id !== id)
    });
  };

  // Update todo text
  const updateTodo = (id, newText) => {
    const currentData = getCurrentData();
    updateCurrentData({
      todos: currentData.todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    });
    setEditingTodo(null);
  };

  const currentData = getCurrentData();
  const datesWithData = getDatesWithData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Daily Notes & Tasks
          </h1>
          <p className="text-gray-600">Organize your thoughts and stay productive</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Date List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Journal
              </h2>
              
              {/* Date Picker Button */}
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Jump to Date
              </button>

              {showDatePicker && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setShowDatePicker(false);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Current Date */}
              <div className="mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
                <div className="text-sm opacity-90">Current Date</div>
                <div className="text-lg font-semibold">{formatDate(selectedDate)}</div>
              </div>

              {/* Dates List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {datesWithData.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No entries yet. Start writing!
                  </p>
                ) : (
                  datesWithData.map(date => {
                    const dateData = data[date];
                    const isSelected = date === selectedDate;
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          isSelected
                            ? 'bg-indigo-100 border-2 border-indigo-300 shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-md'
                        }`}
                      >
                        <div className="font-medium text-gray-800">{formatDate(date)}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {dateData.notes && <span className="inline-flex items-center gap-1"><StickyNote className="w-3 h-3" /> Notes</span>}
                          {dateData.notes && dateData.todos.length > 0 && ' • '}
                          {dateData.todos.length > 0 && <span className="inline-flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {dateData.todos.length} tasks</span>}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-indigo-600" />
                  Notes for {formatDate(selectedDate)}
                </h2>
                <button
                  onClick={() => setEditingNote(!editingNote)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {editingNote ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </button>
              </div>
              
              {editingNote ? (
                <textarea
                  value={currentData.notes}
                  onChange={(e) => updateCurrentData({ notes: e.target.value })}
                  placeholder="Write your thoughts, ideas, or reflections here..."
                  className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  autoFocus
                />
              ) : (
                <div className="min-h-48 p-4 bg-gray-50 rounded-xl">
                  {currentData.notes ? (
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{currentData.notes}</pre>
                  ) : (
                    <p className="text-gray-500 italic">Click the edit button to start writing...</p>
                  )}
                </div>
              )}
            </div>

            {/* Todo Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                Tasks for {formatDate(selectedDate)}
              </h2>
              
              {/* Add Todo */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>

              {/* Todo List */}
              <div className="space-y-3">
                {currentData.todos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 italic">No tasks yet. Add one above!</p>
                ) : (
                  currentData.todos.map(todo => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        todo.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          todo.completed
                            ? 'bg-green-500 border-green-500 text-white'
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
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                          onDoubleClick={() => setEditingTodo(todo.id)}
                        >
                          {todo.text}
                        </span>
                      )}
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Progress */}
              {currentData.todos.length > 0 && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-indigo-800">Progress</span>
                    <span className="text-sm text-indigo-600">
                      {currentData.todos.filter(t => t.completed).length} of {currentData.todos.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTakingApp;