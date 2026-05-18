import React from 'react';

interface TopLeftTextStripProps {
  projectName?: string;
  stage?: string;
  saveStatus?: 'idle' | 'saving' | 'error';
  onProjectClick: () => void;
  onStageClick: () => void;
  onRetrySave?: () => void;
}

const TopLeftTextStrip: React.FC<TopLeftTextStripProps> = ({ projectName, stage, saveStatus = 'idle', onProjectClick, onStageClick, onRetrySave }) => {
  return (
    <div className="text-[12px] text-gray-500 font-medium">
      <span className="cursor-pointer hover:text-gray-800 transition-colors" onClick={onProjectClick}>
        {projectName || 'Loading...'}
      </span>
      <span className="mx-2">&middot;</span>
      <span className="cursor-pointer hover:text-gray-800 transition-colors" onClick={onStageClick}>
        {stage || 'Unknown Stage'}
      </span>
      <span className="mx-2">&middot;</span>
      {saveStatus === 'idle' && <span>✓ Saved</span>}
      {saveStatus === 'saving' && <span>Saving…</span>}
      {saveStatus === 'error' && (
        <span 
          className="text-red-600 cursor-pointer hover:text-red-800 transition-colors" 
          onClick={onRetrySave}
        >
          ⚠ Save failed
        </span>
      )}
    </div>
  );
};

export default TopLeftTextStrip;
