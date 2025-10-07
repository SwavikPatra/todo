// components/Header.jsx
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Sun, FileText, Columns, LayoutList } from 'lucide-react';

const Header = ({
  selectedDate,
  formatDate,
  navigateDate,
  setShowJournalPopup,
  darkMode,
  cardClasses,
  layoutMode,
  setLayoutMode,
  setShowGeneralNotePopup,
  setDarkMode
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
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

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setLayoutMode(layoutMode === 'stacked' ? 'tabbed' : 'stacked')}
          className={`p-2 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-purple-400' 
              : 'bg-white hover:bg-gray-50 text-purple-600 shadow-md'
          }`}
          title={layoutMode === 'stacked' ? 'Switch to Tabbed View' : 'Switch to Stacked View'}
        >
          {layoutMode === 'stacked' ? <Columns className="w-5 h-5" /> : <LayoutList className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setShowGeneralNotePopup(true)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-indigo-400' 
              : 'bg-white hover:bg-gray-50 text-indigo-600 shadow-md'
          }`}
          title="General Notes"
        >
          <FileText className="w-5 h-5" />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-white hover:bg-gray-50 text-gray-600 shadow-md'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Header;