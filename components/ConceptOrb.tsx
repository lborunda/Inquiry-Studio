
import React, { useEffect, useRef } from 'react';
import { OrbAction } from '../types';
import { DefinitionIcon, IssuesIcon, ResearchIcon, SynonymIcon } from './icons';

interface ConceptOrbProps {
    orbState: {
        x: number;
        y: number;
        word: string;
    };
    onAction: (action: OrbAction, word: string) => void;
    onClose: () => void;
}

const actionConfig = [
    { type: OrbAction.DEFINITION, icon: DefinitionIcon, angle: -90 },
    { type: OrbAction.POTENTIAL_ISSUES, icon: IssuesIcon, angle: 0 },
    { type: OrbAction.RESEARCH, icon: ResearchIcon, angle: 180 },
    { type: OrbAction.SYNONYMS, icon: SynonymIcon, angle: 90 },
];

const ConceptOrb = ({ orbState, onAction, onClose }: ConceptOrbProps) => {
    const orbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (orbRef.current && !orbRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [onClose]);

    const radius = 60; // The radius of the circle on which icons lie

    return (
        <div 
            ref={orbRef}
            className="fixed z-30" 
            style={{ 
                left: orbState.x, 
                top: orbState.y,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Center Word */}
                <div className="absolute flex items-center justify-center bg-white border-2 border-gray-800 rounded-full w-24 h-24 shadow-lg">
                   <span className="text-gray-800 font-bold text-sm text-center px-1 truncate">{orbState.word}</span>
                </div>

                {/* Action Buttons */}
                {actionConfig.map(({ type, icon: Icon, angle }, index) => {
                    const x = radius * Math.cos(angle * Math.PI / 180);
                    const y = radius * Math.sin(angle * Math.PI / 180);
                    return (
                        <button
                            key={type}
                            onClick={(e) => { e.stopPropagation(); onAction(type, orbState.word); }}
                            title={type}
                            className="absolute bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-transform hover:scale-110"
                            style={{
                                transform: `translate(${x}px, ${y}px)`,
                            }}
                        >
                           <Icon className="w-5 h-5" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ConceptOrb;