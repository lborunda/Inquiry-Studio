
import React, { useState, useRef, useEffect } from 'react';
import { InquiryMove } from '../types';
import { ChevronDownIcon } from './icons';

interface TutorModeSelectorProps {
    move: InquiryMove;
    onMoveChange: (move: InquiryMove) => void;
}

const TutorModeSelector = ({ move, onMoveChange }: TutorModeSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-left w-full">
                <div>
                    <h3 className="font-bold text-base leading-tight">Inquiry Move</h3>
                    <p className="text-sm text-gray-600 leading-tight">
                        <span className="font-semibold">{move}</span>
                    </p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="p-1">
                        {Object.values(InquiryMove).map(m => (
                            <button
                                key={m}
                                onClick={() => { onMoveChange(m); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md flex justify-between items-center ${move === m ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}
                            >
                                <span>{m}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorModeSelector;
