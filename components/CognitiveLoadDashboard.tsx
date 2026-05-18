import React from 'react';

export default function CognitiveLoadDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Cognitive Load Dashboard</h2>
        <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm italic">NASA-TLX trajectory chart placeholder</p>
        </div>
        <p className="mt-4 text-sm text-gray-600">Track your mental effort over time alongside saved versions and critiques.</p>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200">Close</button>
      </div>
    </div>
  );
}
