// components/NotesSection.jsx
import React, { useRef, useEffect } from 'react';
import { StickyNote, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

const NotesSection = ({
  currentData,
  updateCurrentData,
  selectedDate,
  formatDate,
  darkMode,
  cardClasses,
  layoutMode
}) => {
  const notesEditorRef = useRef(null);

  // Update editor content when date changes OR when currentData.notes changes
  useEffect(() => {
    if (notesEditorRef.current) {
      const currentContent = notesEditorRef.current.innerHTML;
      const newContent = currentData.notes || '';
      
      // Only update if content is different to avoid cursor jumping
      if (currentContent !== newContent) {
        notesEditorRef.current.innerHTML = newContent;
      }
    }
  }, [selectedDate, currentData.notes]);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    notesEditorRef.current?.focus();
  };

  const handleNotesInput = (e) => {
    const content = e.currentTarget.innerHTML;
    updateCurrentData({ notes: content });
  };

  const getCurrentLineText = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return '';
    
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    
    // Get the parent element (div or the editor itself)
    let lineElement = node;
    if (node.nodeType === Node.TEXT_NODE) {
      lineElement = node.parentElement;
    }
    
    // If we're at the root level, get text content directly
    if (lineElement === notesEditorRef.current) {
      return node.textContent || '';
    }
    
    // Get all text content from the current line
    let currentLine = '';
    let currentNode = node;
    
    // Navigate to the start of the line (after last <br> or start of content)
    while (currentNode && currentNode.previousSibling) {
      const prev = currentNode.previousSibling;
      if (prev.nodeName === 'BR') break;
      currentNode = prev;
    }
    
    // Collect text until next <br> or end
    while (currentNode) {
      if (currentNode.nodeName === 'BR') break;
      if (currentNode.nodeType === Node.TEXT_NODE) {
        currentLine += currentNode.textContent;
      } else if (currentNode.textContent) {
        currentLine += currentNode.textContent;
      }
      currentNode = currentNode.nextSibling;
    }
    
    return currentLine;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const currentLine = getCurrentLineText();
      const numberedListMatch = currentLine.match(/^(\d+)\.\s(.*)$/);
      
      if (numberedListMatch) {
        const currentNumber = parseInt(numberedListMatch[1]);
        const content = numberedListMatch[2].trim();
        
        if (content === '') {
          // Empty line - exit the list
          // Delete the number and move to a new clean line
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          
          // Find and remove the number text
          let node = range.startContainer;
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            const match = text.match(/^(\d+)\.\s/);
            if (match) {
              // Remove just the number part
              node.textContent = text.substring(match[0].length);
            }
          }
          
          // Insert two line breaks for clean exit
          document.execCommand('insertHTML', false, '<br><br>');
        } else {
          // Continue the list with next number
          const nextNumber = currentNumber + 1;
          document.execCommand('insertHTML', false, `<br>${nextNumber}. `);
        }
      } else {
        // Not in a numbered list, just insert a line break
        document.execCommand('insertHTML', false, '<br>');
      }
    }
  };

  const editorClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-200';

  return (
    <div className={`${layoutMode === 'stacked' ? cardClasses + ' rounded-2xl shadow-xl' : ''} p-6`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <StickyNote className="w-5 h-5 text-indigo-600" />
        Notes for {formatDate(selectedDate)}
      </h2>
      
      <div className={`flex flex-wrap gap-2 mb-3 p-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <button
          onClick={() => applyFormat('bold')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className={`w-px h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <button
          onClick={() => applyFormat('insertUnorderedList')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat('insertOrderedList')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={notesEditorRef}
        contentEditable
        onInput={handleNotesInput}
        onBlur={handleNotesInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 overflow-y-auto ${editorClasses}`}
        style={{ 
          minHeight: '400px',
          maxHeight: 'calc(100vh - 400px)',
          direction: 'ltr',
          unicodeBidi: 'plaintext'
        }}
        data-placeholder="Click here to start writing your thoughts, ideas, or reflections..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: ${darkMode ? '#9CA3AF' : '#6B7280'};
          pointer-events: none;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default NotesSection;