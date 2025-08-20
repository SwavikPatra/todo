import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, X, Edit3, Save, Trash2, StickyNote, CheckSquare, Tag, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({});
  const [showJournalPopup, setShowJournalPopup] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load data and theme from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('notesAppData');
    const savedTheme = localStorage.getItem('notesAppTheme');
    
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('notesAppData', JSON.stringify(data));
  }, [data]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('notesAppTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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

  // Navigate dates
  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
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

  // Handle notes change (save immediately)
  const handleNotesChange = (e) => {
    updateCurrentData({ notes: e.target.value });
  };
  
  // New function to handle notes blur
  const handleNotesBlur = (e) => {
    // The handleNotesChange function is already handling the update,
    // so this function can simply be a placeholder or perform additional actions if needed.
    // We'll leave it as a simple function to satisfy the prop.
    // The onBlur event is not strictly necessary as notes are saved on every change,
    // but we can keep it to fix the error.
  };

  const currentData = getCurrentData();
  const datesWithData = getDatesWithData();

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white';

  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' 
    : 'bg-white border-gray-200 focus:border-indigo-500';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header - Date Navigation and Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          {/* Minimal Date Navigation */}
          <div className={`${cardClasses} rounded-xl shadow-lg p-3 flex-1 max-w-md`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateDate(-1)}
                className={`p-1.5 rounded-md transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formatDate(selectedDate)}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowJournalPopup(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Journal
                </button>
              </div>
              
              <button
                onClick={() => navigateDate(1)}
                className={`p-1.5 rounded-md transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all duration-200 ml-4 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-600 shadow-md'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Notes Section */}
            <div className={`${cardClasses} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <StickyNote className="w-5 h-5 text-indigo-600" />
                Notes for {formatDate(selectedDate)}
              </h2>
              
              <textarea
                defaultValue={currentData.notes}
                onChange={handleNotesChange}
                placeholder="Click here to start writing your thoughts, ideas, or reflections..."
                className={`w-full h-48 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none transition-all duration-200 ${inputClasses} ${
                  darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                }`}
              />
            </div>

            {/* Todo Section */}
            <div className={`${cardClasses} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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

              {/* Todo List */}
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

              {/* Progress */}
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
          </div>
        </div>

      {/* Journal Popup */}
      {showJournalPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${cardClasses} rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Journal
              </h2>
              <button
                onClick={() => setShowJournalPopup(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${inputClasses}`}
              />
            </div>

            {/* Dates List */}
            <div className="space-y-2">
              {datesWithData.length === 0 ? (
                <p className={`text-sm text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No entries yet. Start writing!
                </p>
              ) : (
                datesWithData.map(date => {
                  const dateData = data[date];
                  const isSelected = date === selectedDate;
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setShowJournalPopup(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? darkMode 
                            ? 'bg-indigo-900/30 border-2 border-indigo-400'
                            : 'bg-indigo-100 border-2 border-indigo-300 shadow-md'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-md'
                      }`}
                    >
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {formatDate(date)}
                      </div>
                      <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
      )}
    </div>
  );
}

export default App;