import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { InquiryStage } from '../types';
import { PanelLeftClose } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (action: string, payload?: any) => void;
  activeStage: InquiryStage;
  isDocked?: boolean;
  onToggleDock?: () => void;
}

export default function CommandPalette({ isOpen, onClose, onExecute, activeStage, isDocked, onToggleDock }: CommandPaletteProps) {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');

  // Handle Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen && !isDocked) onClose();
        else onExecute('open-command-palette'); 
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, isDocked, onClose, onExecute]);

  if (!isOpen && !isDocked) return null;

  const handleAction = (action: string, payload?: any) => {
    onExecute(action, payload);
    if (!isDocked) onClose();
  };

  const overlayClass = isDocked ? '' : 'fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40';
  const containerClass = isDocked 
    ? 'flex-shrink-0 flex flex-col h-full w-[280px] bg-[#171717] border-r border-gray-800 text-gray-200 z-30'
    : 'fixed z-50 top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[80vh] flex flex-col bg-[#171717] rounded-xl shadow-2xl overflow-hidden border border-gray-800 text-gray-200';

  return (
    <>
      {!isDocked && <div className={overlayClass} onClick={onClose} />}
      <div className={containerClass}>
        <Command 
          className="flex-1 flex flex-col min-h-0 bg-transparent"
          value={value}
          onValueChange={setValue}
          loop
        >
          <div className="flex items-center px-4 border-b border-gray-800 relative">
            <Command.Input 
              autoFocus={!isDocked}
              className="w-full bg-transparent py-4 pr-8 text-base outline-none placeholder:text-gray-500 font-spacemono text-white" 
              placeholder="Type a command..."
              value={search}
              onValueChange={setSearch}
            />
            {isDocked && onToggleDock && (
              <button 
                onClick={onToggleDock} 
                className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                title="Undock menu"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
            {!isDocked && onToggleDock && (
              <button 
                onClick={onToggleDock} 
                className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                title="Dock to sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          <Command.List className="flex-1 overflow-y-auto p-2 outline-none custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-gray-500">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigate" className="px-2 py-1.5 text-xs font-semibold text-gray-500 [&_[cmdk-group-heading]]:mb-2">
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('switch-project')}>Switch project...</Command.Item>
            <Command.Item className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('switch-stage')}><span>Switch stage...</span></Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('open-inquiry-map')}>Open Inquiry Map</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('open-researcher-network')}>Open Researcher Network</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('open-references')}>Open References</Command.Item>
          </Command.Group>

          <Command.Group heading="AI Actions" className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
            <Command.Item className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('analyze-full-text')}><span>Analyze full text</span><span className="text-gray-500 text-xs">⌘⇧A</span></Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('visual-tool', 'argument-map')}>Visual tool: Argument map</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('visual-tool', 'semantic-network')}>Visual tool: Semantic network</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('visual-tool', 'mental-map')}>Visual tool: Mental map</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('explore-concept-disciplines')}>Explore this concept across disciplines</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('re-analyze')}>Re-analyze</Command.Item>
          </Command.Group>

          <Command.Group heading="Edit" className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
            <Command.Item className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('save-version')}><span>Save version</span><span className="text-gray-500 text-xs">⌘S</span></Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('insert-image')}>Insert image</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('insert-reference')}>Insert reference</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('invite-collaborator')}>Invite collaborator</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('manage-collaborators')}>Manage collaborators</Command.Item>
          </Command.Group>

          <Command.Group heading="View" className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
            <Command.Item className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('open-inquiry-trail')}><span>Inquiry Trail</span><span className="text-gray-500 text-xs">⌘T</span></Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('open-rubric')}>Rubric for current stage</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('revisit-earlier-phase')}>Revisit earlier phase</Command.Item>
          </Command.Group>

          <Command.Group heading="Setup" className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('session-goals')}>Session goals</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('ai-literacy-guide')}>AI Literacy guide</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('set-expertise-level')}>Set expertise level</Command.Item>
          </Command.Group>

          <Command.Group heading="Help" className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('tutorial')}>Tutorial</Command.Item>
            <Command.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-800/80 data-[selected=true]:bg-gray-800/80 data-[selected=true]:text-[#C9A961] transition-colors" onSelect={() => handleAction('about-feedback')}>About / Feedback</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
    </>
  );
}
