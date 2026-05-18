import React, { useState } from 'react';
import { Project, VersionEvent, CritiqueEvent } from '../types';
import VersionDiff from './VersionDiff';

interface InquiryTrailProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onRestore: (text: string) => void;
}

export default function InquiryTrail({ isOpen, onClose, project, onRestore }: InquiryTrailProps) {
  const [expandedDiffId, setExpandedDiffId] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  // Interleave and sort chronologically
  const events = [
    ...(project.versionEvents || []),
    ...(project.critiqueEvents || [])
  ].sort((a, b) => b.timestamp - a.timestamp); // reverse chronological

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[360px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-200 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Inquiry Trail</h2>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.length === 0 && <p className="text-sm text-gray-400 text-center mt-10">No history yet.</p>}
        {events.map((evt) => {
          const isCritique = 'items' in evt;
          if (isCritique) {
            const c = evt as CritiqueEvent;
            return (
              <div key={c.id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm">
                <div className="flex justify-between items-start mb-1 text-xs text-blue-600 font-medium">
                  <span>Critique received</span>
                  <span>{new Date(c.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-600 line-clamp-2">{c.items[0]?.text}</div>
                <div className="mt-2 text-xs text-blue-500">
                  {c.items.length} points
                </div>
              </div>
            );
          } else {
            const v = evt as VersionEvent;
            // Find the previous version for diffing
            const currentIndex = events.indexOf(v);
            const prevVersionEvent = events.slice(currentIndex + 1).find(e => !('items' in e)) as VersionEvent | undefined;
            const isExpanded = expandedDiffId === v.id;

            return (
              <div key={v.id} className="p-3 bg-gray-50 border border-gray-100 flex flex-col rounded-lg text-sm group hover:border-[#C9A961] transition-colors">
                <div className="flex justify-between items-start mb-1 text-xs text-gray-500 font-medium uppercase">
                  <span>{v.trigger === 'manual' ? 'Saved Version' : v.trigger === 'pre-critique' ? 'Auto-save (Analysis)' : 'Auto-save (Revision)'}</span>
                  <span>{new Date(v.timestamp).toLocaleTimeString()}</span>
                </div>
                {v.label && <div className="font-medium text-gray-800 mt-1">{v.label}</div>}
                
                {isExpanded ? (
                  <div className="mt-2">
                    <VersionDiff oldVersion={prevVersionEvent || null} newVersion={v} />
                  </div>
                ) : (
                  <div className="text-gray-600 line-clamp-2 mt-1 italic">"{v.text.slice(0, 80).replace(/<[^>]+>/g, '')}..."</div>
                )}
                
                <div className="mt-2 flex justify-between items-center text-right">
                  <button onClick={() => setExpandedDiffId(isExpanded ? null : v.id)} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
                    {isExpanded ? 'Hide changes' : 'Show changes'}
                  </button>
                  <button onClick={() => onRestore(v.text)} className="text-xs text-[#C9A961] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">Restore</button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
