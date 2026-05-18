import React from 'react';
import { Sparkles, Clock, Settings } from 'lucide-react';

interface CompanionIconRowProps {
  onAnalyze: () => void;
  onOpenTrail: () => void;
  onOpenSettings: () => void;
}

export default function CompanionIconRow({ onAnalyze, onOpenTrail, onOpenSettings }: CompanionIconRowProps) {
  return (
    <div className="flex justify-end items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
      <button 
        onClick={onAnalyze} 
        title="Analyze full text"
        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      <button 
        onClick={onOpenTrail} 
        title="Inquiry Trail"
        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
      >
        <Clock className="w-5 h-5" />
      </button>
      <button 
        onClick={onOpenSettings} 
        title="Setup & Settings"
        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
