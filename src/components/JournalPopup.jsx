// components/JournalPopup.jsx
import React from 'react';
import { Calendar, X, StickyNote, CheckSquare } from 'lucide-react';

const JournalPopup = ({
  darkMode,
  cardClasses,
  selectedDate,
  setSelectedDate,
  datesWithData,
  data,
  formatDate,
  setShowJournalPopup
}) => {
  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' 
    : 'bg-white border-gray-200 focus:border-indigo-500';

  return (
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

        <div className="mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${inputClasses}`}
          />
        </div>

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
  );
};

export default JournalPopup;