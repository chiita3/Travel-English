
import React from 'react';
import { SavedPhrase } from '../types';

interface WordBookProps {
  phrases: SavedPhrase[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const WordBook: React.FC<WordBookProps> = ({ phrases, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-violet-600">My Phrasebook</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
        </header>
        <main className="flex-grow overflow-y-auto p-4">
          {phrases.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Your saved phrases will appear here. Tap the bookmark icon in a conversation to save a phrase.</p>
          ) : (
            <ul className="space-y-3">
              {phrases.map((phrase) => (
                <li key={phrase.id} className="p-3 bg-slate-100 rounded-lg flex justify-between items-start gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{phrase.text}</p>
                    <p className="text-sm text-slate-500">{phrase.scene}</p>
                  </div>
                  <button onClick={() => onDelete(phrase.id)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default WordBook;
