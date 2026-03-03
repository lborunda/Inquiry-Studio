
import React, { useState, useEffect } from 'react';
import { UploadedFile } from '../types';
import { summarizeFile } from '../services/geminiService';
import { LockIcon, FileIcon } from './icons';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorFiles: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const AdminModal = ({ isOpen, onClose, instructorFiles, onFilesChange }: AdminModalProps) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [summaries, setSummaries] = useState<Record<string, { loading: boolean; text: string | undefined }>>({});

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
      setIsAuthenticated(false);
    }
  }, [isOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  const handleSummarize = async (file: UploadedFile) => {
    setSummaries(prev => ({ ...prev, [file.id]: { loading: true, text: prev[file.id]?.text } }));
    const summaryText = await summarizeFile(file.name);
    setSummaries(prev => ({ ...prev, [file.id]: { loading: false, text: summaryText } }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <LockIcon className="w-6 h-6" /> Instructor Panel
        </h2>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit}>
            <p className="mb-2 text-gray-600">Enter password to access instructor settings.</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="Password"
              />
              <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">Unlock</button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mt-6 mb-2">Syllabus & RAG Materials</h3>
            <p className="text-sm text-gray-500 mb-4">These documents provide background context for the AI tutor across all student sessions.</p>
            <ul className="space-y-3">
              {instructorFiles.map(file => (
                <li key={file.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileIcon className="w-5 h-5 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleSummarize(file)}
                      disabled={summaries[file.id]?.loading}
                      className="text-sm text-gray-800 font-medium hover:underline disabled:opacity-50 disabled:cursor-wait"
                    >
                      {summaries[file.id]?.loading ? 'Summarizing...' : 'Summarize'}
                    </button>
                  </div>
                  {summaries[file.id]?.text && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                      <p className="font-semibold text-gray-700">Summary:</p>
                      <p>{summaries[file.id]?.text}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
