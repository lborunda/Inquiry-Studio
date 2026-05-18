import React, { useMemo } from 'react';
import * as Diff from 'diff';
import { VersionEvent } from '../types';

interface VersionDiffProps {
  oldVersion: VersionEvent | null; // null if showing current text against a version
  newVersion: VersionEvent | null; // new version or current text
  currentText?: string;
}

const VersionDiff: React.FC<VersionDiffProps> = ({ oldVersion, newVersion, currentText }) => {
  const oldText = oldVersion ? oldVersion.text : '';
  const newText = newVersion ? newVersion.text : (currentText || '');

  // Strip html tags just for a cleaner text diff if needed, 
  // but diffing HTML might be messy. The prompt suggests a lightweight
  // diff. We will diff the stripped text and present it line by line.
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const diffs = useMemo(() => {
    const oldStripped = stripHtml(oldText);
    const newStripped = stripHtml(newText);
    return Diff.diffWordsWithSpace(oldStripped, newStripped);
  }, [oldText, newText]);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm whitespace-pre-wrap font-sans text-gray-800 leading-relaxed max-h-[500px] overflow-y-auto">
      {diffs.map((part, index) => {
        const style = part.added
          ? 'bg-green-100 text-green-800 rounded px-0.5'
          : part.removed
          ? 'bg-red-100 text-red-800 line-through rounded px-0.5 opacity-70'
          : '';
        return (
          <span key={index} className={style}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};

export default VersionDiff;
