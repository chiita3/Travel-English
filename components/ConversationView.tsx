
import React, { useState, useEffect, useRef } from 'react';
import { Scene, Country, MessageRole, ChatMessage } from '../types';
import { COUNTRIES } from '../constants';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { getPronunciationFeedback } from '../utils';
import { UserAvatar, ModelAvatar } from './PracticeView';


interface ConversationViewProps {
  scene: Scene;
  country: Country;
  onBack: () => void;
  onSavePhrase: (phrase: string) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ scene, country, onBack, onSavePhrase }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const countryConfig = COUNTRIES.find(a => a.value === country);

  const { startSession, stopSession, isConnected, userTurn, modelTurn } = useGeminiLive({
    voice: countryConfig?.voice || 'Zephyr',
    systemInstruction: scene.prompt
  });

  useEffect(() => {
    startSession();
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, country]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (userTurn?.isFinal) {
        const lastModelMessage = [...messages].reverse().find(m => m.role === MessageRole.Model);
        
        const fetchFeedback = async () => {
            const feedback = await getPronunciationFeedback(lastModelMessage?.text || '', userTurn.text);
            const newMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: MessageRole.User,
                text: userTurn.text,
                pronunciationFeedback: feedback || undefined,
            };
            setMessages(prev => [...prev, newMessage]);
        };
        fetchFeedback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTurn]);

  useEffect(() => {
    if (modelTurn?.isFinal) {
        const newMessage: ChatMessage = {
            id: `model-${Date.now()}`,
            role: MessageRole.Model,
            text: modelTurn.text,
        };
        setMessages(prev => [...prev, newMessage]);
    }
  }, [modelTurn]);

  const toggleRecording = () => {
    // This is a placeholder for user interaction. The hook handles continuous listening.
    // We can use this state to show visual feedback on the mic.
    setIsRecording(!isRecording); 
  };
  
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[calc(100vh-150px)] max-h-[800px] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800">&larr; Back to Practice</button>
            <div className="text-center">
                <h2 className="text-xl font-bold">{scene.emoji} {scene.title}</h2>
                <p className="text-sm text-slate-500">{countryConfig?.label}</p>
            </div>
            <div className="w-32"></div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 mb-4 ${msg.role === MessageRole.User ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === MessageRole.Model && <ModelAvatar />}
                    <div className={`rounded-2xl p-3 max-w-sm md:max-w-md ${msg.role === MessageRole.User ? 'bg-violet-500 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                         <div className="flex items-center justify-between gap-4">
                            <p>{msg.text}</p>
                            {msg.role === MessageRole.Model && (
                                <button onClick={() => onSavePhrase(msg.text)} title="Save phrase" className="text-slate-400 hover:text-violet-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" /></svg>
                                </button>
                            )}
                        </div>
                        {msg.role === MessageRole.User && msg.pronunciationFeedback && (
                            <div className="mt-2 pt-2 border-t border-violet-400">
                                <p className="text-sm font-bold">Feedback: <span className={getScoreColor(msg.pronunciationFeedback.score)}>{msg.pronunciationFeedback.score}/100</span></p>
                                <div className="text-sm flex flex-wrap gap-x-1">
                                    {msg.pronunciationFeedback.words.map((word, i) => (
                                        <span key={i} className={word.isCorrect ? 'text-violet-200' : 'text-rose-300 underline'}>{word.word}</span>
                                    ))}
                                </div>
                                <p className="text-sm mt-2 text-violet-200 bg-violet-600/50 p-2 rounded-md">
                                    💡 <span className="font-bold">Tip:</span> {msg.pronunciationFeedback.advice}
                                </p>
                            </div>
                        )}
                    </div>
                     {msg.role === MessageRole.User && <UserAvatar />}
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t flex flex-col items-center justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isConnected ? 'bg-violet-500' : 'bg-slate-400'}`}>
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    {isConnected ? (
                        <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
                    ) : (
                         <div className="w-5 h-5 bg-slate-500 rounded-full"></div>
                    )}
                </div>
            </div>
            <p className="mt-2 text-sm text-slate-500">
                {isConnected ? 'Start speaking to practice' : 'Connecting...'}
            </p>
        </div>
    </div>
  );
};

export default ConversationView;
