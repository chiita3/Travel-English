import React, { useState, useCallback } from 'react';
import { Country, Scene, SavedPhrase } from './types';
import { COUNTRIES, SCENES } from './constants';
import SceneSelector from './components/SceneSelector';
import ConversationView from './components/ConversationView';
import PracticeView from './components/PracticeView';
import CountrySelector from './components/AccentSelector';
import WordBook from './components/WordBook';

type View = 'sceneSelector' | 'practice' | 'conversation';

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [country, setCountry] = useState<Country>(Country.USA);
  const [view, setView] = useState<View>('sceneSelector');
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [isWordBookOpen, setIsWordBookOpen] = useState(false);
  
  const handleSelectScene = useCallback((scene: Scene) => {
    setCurrentScene(scene);
    setExampleIndex(Math.floor(Math.random() * scene.exampleSets.length));
    setView('practice');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentScene(null);
    setView('sceneSelector');
  }, []);

  const handleStartConversation = useCallback(() => {
    if (currentScene) {
      setView('conversation');
    }
  }, [currentScene]);
  
  const handleBackToPractice = useCallback(() => {
    setView('practice');
  }, []);

  const handleNextExample = useCallback(() => {
    if (currentScene) {
        setExampleIndex(prev => (prev + 1) % currentScene.exampleSets.length);
    }
  }, [currentScene]);


  const handleSavePhrase = useCallback((phrase: string) => {
    if (!currentScene || savedPhrases.some(p => p.text === phrase)) return;
    const newPhrase: SavedPhrase = {
      id: Date.now().toString(),
      text: phrase,
      scene: currentScene.title,
    };
    setSavedPhrases(prev => [...prev, newPhrase]);
  }, [currentScene, savedPhrases]);

  const handleDeletePhrase = useCallback((id: string) => {
    setSavedPhrases(prev => prev.filter(p => p.id !== id));
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'practice':
        return currentScene && (
          <PracticeView 
            scene={currentScene}
            exampleIndex={exampleIndex}
            country={country}
            onBack={handleBackToHome}
            onStartConversation={handleStartConversation}
            onNextExample={handleNextExample}
          />
        );
      case 'conversation':
        return currentScene && (
           <ConversationView 
            scene={currentScene} 
            country={country} 
            onBack={handleBackToPractice} 
            onSavePhrase={handleSavePhrase}
          />
        );
      case 'sceneSelector':
      default:
        return <SceneSelector onSelectScene={handleSelectScene} />;
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-600 cursor-pointer" onClick={handleBackToHome}>
            Travel English
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsWordBookOpen(true)}
              className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors"
              aria-label="Open Phrasebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-8.494h11.494" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              <span className="hidden sm-inline">Phrasebook</span>
            </button>
            <CountrySelector selectedCountry={country} onSelectCountry={setCountry} />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      {isWordBookOpen && (
        <WordBook 
          phrases={savedPhrases} 
          onClose={() => setIsWordBookOpen(false)}
          onDelete={handleDeletePhrase}
        />
      )}
    </div>
  );
};

export default App;