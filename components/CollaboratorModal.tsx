import React from 'react';

export default function CollaboratorModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Manage Collaborators</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input type="email" placeholder="colleague@example.com" className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm" />
            <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">Invite</button>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Current</h3>
            <div className="text-sm text-gray-600">No collaborators yet.</div>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200">Close</button>
      </div>
    </div>
  );
}
