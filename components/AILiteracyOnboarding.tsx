import React, { useState } from 'react';

export default function AILiteracyOnboarding({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-md p-6 flex flex-col min-h-[300px]">
        {slide === 0 && (
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 font-sans tracking-tight">AI in Inquiry Studio</h2>
            <p className="text-gray-600">The AI is a companion, not an oracle. It can help you see structure, find connections, and critique arguments, but it doesn't know your specific context or reality.</p>
          </div>
        )}
        {slide === 1 && (
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 font-sans tracking-tight">Critique as Questions</h2>
            <p className="text-gray-600">Treat AI critiques as questions to provoke your own thinking, rather than commands you must follow. You are always the author.</p>
          </div>
        )}
        {slide === 2 && (
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 font-sans tracking-tight">Verify Citations</h2>
            <p className="text-gray-600">AI can hallucinate or misattribute citations. Always verify references against your actual sources or the DESK reference manager.</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${slide === i ? 'bg-[#C9A961]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {slide > 0 && <button onClick={() => setSlide(s => s - 1)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Back</button>}
            {slide < 2 ? (
              <button onClick={() => setSlide(s => s + 1)} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">Next</button>
            ) : (
              <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">Got it</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
