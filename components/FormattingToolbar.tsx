
import React from 'react';
import { BoldIcon, ItalicIcon, ListIcon } from './icons';

type FormatCommand = 'bold' | 'italic' | 'insertUnorderedList';

interface FormattingToolbarProps {
  onFormat: (formatType: FormatCommand) => void;
}

const FormattingToolbar = ({ onFormat }: FormattingToolbarProps) => {
  const handleFormat = (e: React.MouseEvent, command: FormatCommand) => {
    e.preventDefault(); // Prevent loss of selection
    onFormat(command);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md border border-gray-200 shadow-md">
      <button onMouseDown={(e) => handleFormat(e, 'bold')} title="Bold" className="p-2 rounded hover:bg-gray-200 transition-colors">
        <BoldIcon className="w-4 h-4 text-gray-700" />
      </button>
      <button onMouseDown={(e) => handleFormat(e, 'italic')} title="Italic" className="p-2 rounded hover:bg-gray-200 transition-colors">
        <ItalicIcon className="w-4 h-4 text-gray-700" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1"></div>
      <button onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} title="Bulleted List" className="p-2 rounded hover:bg-gray-200 transition-colors">
        <ListIcon className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
};

export default FormattingToolbar;