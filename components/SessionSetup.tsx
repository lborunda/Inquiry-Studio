import React, { useState } from 'react';
import { InquiryStage } from '../types';
import { STAGE_RUBRICS } from '../constants';

export default function SessionSetup({ isOpen, onClose, activeStage, expertiseLevel, onExpertiseChange }: { isOpen: boolean, onClose: () => void, activeStage: InquiryStage, expertiseLevel: string, onExpertiseChange: (v: 'novice' | 'intermediate' | 'advanced') => void }) {
  const [tab, setTab] = useState<'goals'|'rubric'|'expertise'>('goals');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-lg overflow-hidden flex flex-col h-[500px]">
        <div className="flex border-b border-gray-100 p-2">
          {['goals', 'rubric', 'expertise'].map(t => (
            <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 text-sm font-medium rounded-md capitalize ${tab===t ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'goals' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Session Intentions</label>
                <textarea className="w-full h-32 p-3 border border-gray-200 rounded-md text-sm resize-none" placeholder="What are you trying to accomplish in this session?" />
              </div>
            </div>
          )}
          {tab === 'rubric' && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">{activeStage}</h3>
              <p className="text-sm text-gray-600">{STAGE_RUBRICS[activeStage]?.description}</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 mt-4">
                {STAGE_RUBRICS[activeStage]?.criteria.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {tab === 'expertise' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Set your self-assessed expertise level. The AI tutor adjusts its scaffolding accordingly.</p>
              {(['novice', 'intermediate', 'advanced'] as const).map(l => (
                <label key={l} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="expertise" checked={expertiseLevel === l} onChange={() => onExpertiseChange(l)} className="w-4 h-4 accent-gray-900" />
                  <span className="capitalize text-sm font-medium text-gray-800">{l}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800">Done</button>
        </div>
      </div>
    </div>
  );
}
