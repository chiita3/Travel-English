
import React from 'react';
import { Scene } from '../types';
import { SCENES } from '../constants';

interface SceneSelectorProps {
  onSelectScene: (scene: Scene) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ onSelectScene }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-center">Choose a Scene</h2>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        Select a situation to start practicing a real-life conversation with AI.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSelectScene(scene)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-white font-bold text-lg ${scene.color} ${scene.hoverColor}`}
          >
            <span className="text-5xl mb-3">{scene.emoji}</span>
            <span>{scene.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneSelector;
