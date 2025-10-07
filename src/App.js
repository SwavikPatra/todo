// App.jsx
import React, { useState, useEffect } from 'react';
import { Moon, Sun, FileText, Columns, LayoutList } from 'lucide-react';
import Header from './components/Header.jsx';
import NotesSection from './components/NotesSection.jsx';
import TasksSection from './components/TasksSection.jsx';
import JournalPopup from './components/JournalPopup.jsx';
import GeneralNotePopup from './components/GeneralNotePopup.jsx';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({});
  const [generalNote, setGeneralNote] = useState('');
  const [showJournalPopup, setShowJournalPopup] = useState(false);
  const [showGeneralNotePopup, setShowGeneralNotePopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState('stacked');
  const [activeTab, setActiveTab] = useState('notes');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('journalData');
    const savedGeneralNote = localStorage.getItem('generalNote');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLayoutMode = localStorage.getItem('layoutMode');
    
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    if (savedGeneralNote) {
      setGeneralNote(savedGeneralNote);
    }
    
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'dark');
    }
    
    if (savedLayoutMode) {
      setLayoutMode(savedLayoutMode);
    }
    
    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Save data to localStorage whenever data changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('journalData', JSON.stringify(data));
    }
  }, [data, isInitialized]);

  // Save general note to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('generalNote', generalNote);
    }
  }, [generalNote, isInitialized]);

  // Save dark mode preference to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
    }
  }, [darkMode, isInitialized]);

  // Save layout mode preference to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('layoutMode', layoutMode);
    }
  }, [layoutMode, isInitialized]);

  const initDateData = (date) => ({
    notes: '',
    todos: [],
    tags: [],
    mood: '',
    priority: 'medium'
  });

  const getCurrentData = () => {
    return data[selectedDate] || initDateData(selectedDate);
  };

  const updateCurrentData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDate]: {
        ...getCurrentData(),
        ...updates
      }
    }));
  };

  const getDatesWithData = () => {
    return Object.keys(data)
      .filter(date => data[date].notes || data[date].todos.length > 0)
      .sort((a, b) => new Date(b) - new Date(a));
  };

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

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const currentData = getCurrentData();
  const datesWithData = getDatesWithData();

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      <div className="container mx-auto px-4 py-8">
        <Header
          selectedDate={selectedDate}
          formatDate={formatDate}
          navigateDate={navigateDate}
          setShowJournalPopup={setShowJournalPopup}
          darkMode={darkMode}
          cardClasses={cardClasses}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          setShowGeneralNotePopup={setShowGeneralNotePopup}
          setDarkMode={setDarkMode}
        />

        {layoutMode === 'stacked' ? (
          <div className="space-y-6">
            <NotesSection
              currentData={currentData}
              updateCurrentData={updateCurrentData}
              selectedDate={selectedDate}
              formatDate={formatDate}
              darkMode={darkMode}
              cardClasses={cardClasses}
              layoutMode={layoutMode}
            />
            <TasksSection
              currentData={currentData}
              updateCurrentData={updateCurrentData}
              selectedDate={selectedDate}
              formatDate={formatDate}
              darkMode={darkMode}
              cardClasses={cardClasses}
              layoutMode={layoutMode}
            />
          </div>
        ) : (
          <div className={`${cardClasses} rounded-2xl shadow-xl`}>
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'notes'
                    ? darkMode
                      ? 'bg-gray-700 text-indigo-400 border-b-2 border-indigo-400'
                      : 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-700/50'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'tasks'
                    ? darkMode
                      ? 'bg-gray-700 text-indigo-400 border-b-2 border-indigo-400'
                      : 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-700/50'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Tasks
              </button>
            </div>

            <div>
              {activeTab === 'notes' ? (
                <NotesSection
                  currentData={currentData}
                  updateCurrentData={updateCurrentData}
                  selectedDate={selectedDate}
                  formatDate={formatDate}
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                  layoutMode={layoutMode}
                />
              ) : (
                <TasksSection
                  currentData={currentData}
                  updateCurrentData={updateCurrentData}
                  selectedDate={selectedDate}
                  formatDate={formatDate}
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                  layoutMode={layoutMode}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {showJournalPopup && (
        <JournalPopup
          darkMode={darkMode}
          cardClasses={cardClasses}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          datesWithData={datesWithData}
          data={data}
          formatDate={formatDate}
          setShowJournalPopup={setShowJournalPopup}
        />
      )}

      {showGeneralNotePopup && (
        <GeneralNotePopup
          darkMode={darkMode}
          cardClasses={cardClasses}
          generalNote={generalNote}
          setGeneralNote={setGeneralNote}
          setShowGeneralNotePopup={setShowGeneralNotePopup}
        />
      )}
    </div>
  );
}

export default App;