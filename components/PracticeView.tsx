
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Scene, Country, ConversationExample, PronunciationFeedback } from '../types';
import { COUNTRIES } from '../constants';
import { getPronunciationFeedback, transcribeAudio } from '../utils';

// --- Assets ---
export const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
);

export const ModelAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-violet-200 border-2 border-violet-300 flex items-center justify-center flex-shrink-0">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
);

// --- Audio Utility Functions ---
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface PracticeViewProps {
  scene: Scene;
  exampleIndex: number;
  country: Country;
  onBack: () => void;
  onStartConversation: () => void;
  onNextExample: () => void;
}

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 00-1 1v.01L7 10v.01a1 1 0 102 0V10a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v.01L11 10v.01a1 1 0 102 0V10a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
}

const PracticeView: React.FC<PracticeViewProps> = ({
  scene,
  exampleIndex,
  country,
  onBack,
  onStartConversation,
  onNextExample,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [practiceSentence, setPracticeSentence] = useState<ConversationExample | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [userTranscription, setUserTranscription] = useState<string>('');
  const [practiceError, setPracticeError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const exampleSet = scene.exampleSets[exampleIndex];
  const countryConfig = COUNTRIES.find(c => c.value === country);
  const voice = countryConfig?.voice || 'Zephyr';

  useEffect(() => {
    audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const handlePlayAudio = useCallback(async (text: string, id: string) => {
    if (playingId) {
        stopAudio();
        if (playingId === id) return;
    }
    
    setPlayingId(id);
    setAudioError(null);

    try {
        const audioContext = audioContextRef.current;
        if (!audioContext) throw new Error('AudioContext not initialized');
        if (audioContext.state === 'suspended') await audioContext.resume();

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice }}},
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
            const source = audioContext.createBufferSource();
            audioSourceRef.current = source;
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            source.onended = () => {
                if(audioSourceRef.current === source){
                    setPlayingId(null);
                    audioSourceRef.current = null;
                }
            };
        } else {
            throw new Error('No audio data received from API.');
        }
    } catch (err: any) {
        console.error('Error playing audio:', err);
        setAudioError('Sorry, could not play audio.');
        setPlayingId(null);
    }
  }, [playingId, voice, stopAudio]);

  const handleProcessAudio = useCallback(async () => {
    if (audioChunksRef.current.length === 0) return;
    setIsProcessing(true);
    setPracticeError('');
    try {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        const base64Audio = await blobToBase64(audioBlob);
        const transcription = await transcribeAudio(base64Audio, 'audio/webm');
        setUserTranscription(transcription);
        
        if (practiceSentence) {
            const fb = await getPronunciationFeedback(practiceSentence.text, transcription);
            setFeedback(fb);
        }
    } catch (err) {
        console.error("Error processing audio", err);
        setPracticeError('Failed to get feedback. Please try again.');
    } finally {
        setIsProcessing(false);
    }
  }, [practiceSentence]);

  const handleStartRecording = useCallback(async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = handleProcessAudio;
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error starting recording", err);
        setPracticeError('Could not access microphone.');
    }
  }, [handleProcessAudio]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        // Stop all media tracks to turn off the mic indicator
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  }, []);

  const resetPracticeState = () => {
    setFeedback(null);
    setUserTranscription('');
    setPracticeError('');
    setIsRecording(false);
    setIsProcessing(false);
    audioChunksRef.current = [];
  };

  const openPracticeModal = (sentence: ConversationExample) => {
    resetPracticeState();
    setPracticeSentence(sentence);
  };

  const closePracticeModal = () => {
    if (isRecording) handleStopRecording();
    setPracticeSentence(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-full max-h-[calc(100vh-120px)] overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800">&larr; Back to Scenes</button>
        <h2 className="text-xl font-bold text-center">{scene.emoji} {scene.title}</h2>
        <div className="w-32"></div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col h-full">
            <img src={exampleSet.image} alt={scene.title} className="w-full h-40 md:h-48 object-cover rounded-xl mb-6 shadow-md flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-6 flex-grow min-h-0">
                <div className="md:w-3/5 lg:w-3/5 bg-slate-50 p-4 rounded-xl border flex flex-col overflow-hidden">
                    <h3 className="font-bold text-lg mb-3 flex-shrink-0">Example Conversation</h3>
                    <div className="space-y-4 overflow-y-auto pr-2">
                        {exampleSet.examples.map((ex, index) => (
                            <div key={index} className={`flex items-start gap-3 ${ex.speaker === 'user' ? 'justify-end' : ''}`}>
                                {ex.speaker === 'model' && <ModelAvatar />}
                                <div className={`rounded-2xl p-3 max-w-sm ${ex.speaker === 'user' ? 'bg-violet-500 text-white rounded-br-lg' : 'bg-white text-slate-800 rounded-bl-lg shadow-sm'}`}>
                                    <p className="text-sm text-slate-400 font-light">{ex.japanese}</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium flex-grow">{ex.text}</p>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => handlePlayAudio(ex.text, `ex-${index}`)} className="text-slate-400 hover:text-yellow-500 transition-colors">
                                                {playingId === `ex-${index}` ? <StopIcon/> : <StarIcon />}
                                            </button>
                                            <button onClick={() => openPracticeModal(ex)} className="text-slate-400 hover:text-violet-600 transition-colors">
                                                <MicrophoneIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {ex.speaker === 'user' && <UserAvatar />}
                            </div>
                        ))}
                        {audioError && <p className="text-red-500 text-sm text-center">{audioError}</p>}
                    </div>
                </div>
                <div className="md:w-2/5 lg:w-2/5 bg-slate-50 p-4 rounded-xl border flex flex-col overflow-hidden">
                    <h3 className="font-bold text-lg mb-2 flex-shrink-0">Vocabulary</h3>
                    <ul className="space-y-3 overflow-y-auto pr-2">
                        {exampleSet.vocabulary.map((item, index) => {
                            const match = item.definition.match(/(.*?)\s*\((.*)\)/);
                            const englishDef = match ? match[1].trim() : item.definition;
                            const japaneseDef = match ? match[2].trim().slice(0, -1) : '';

                            return (
                                <li key={index} className="border-b border-slate-200 pb-2 last:border-b-0">
                                    <p className="font-semibold text-slate-800">
                                        {item.word}
                                        <span className="font-normal text-slate-500 ml-2">{item.japanese}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">{englishDef}</p>
                                    {japaneseDef && <p className="text-sm text-slate-500">{japaneseDef}</p>}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
      </div>
      <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-center gap-4 flex-shrink-0">
        <button onClick={onNextExample} className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-100 transition-colors">Next Example</button>
        <button onClick={onStartConversation} className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors shadow-md">Start Conversation</button>
      </div>
      {practiceSentence && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold">Speaking Practice</h3>
                    <button onClick={closePracticeModal} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </header>
                <main className="p-6 text-center">
                    <p className="text-slate-500 mb-1 text-sm">Say this phrase:</p>
                    <p className="text-xl font-semibold mb-6">{practiceSentence.text}</p>
                    {feedback ? (
                        <div className="text-left">
                            <p className="font-semibold">Your attempt: <span className="text-slate-600 font-normal">{userTranscription || 'No speech detected.'}</span></p>
                            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                                <p className="text-sm font-bold">Feedback: <span className={getScoreColor(feedback.score)}>{feedback.score}/100</span></p>
                                <div className="text-sm flex flex-wrap gap-x-1 my-1">
                                    {feedback.words.map((word, i) => (
                                        <span key={i} className={word.isCorrect ? 'text-slate-700' : 'text-red-500 underline decoration-wavy'}>{word.word}</span>
                                    ))}
                                </div>
                                <p className="text-sm mt-2 text-slate-800 bg-yellow-100 border border-yellow-200 p-2 rounded-md">
                                    💡 <span className="font-bold">Tip:</span> {feedback.advice}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <button onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isProcessing} className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-500 hover:bg-violet-600'}`}>
                                {isRecording ? 
                                    <div className="w-8 h-8 bg-white rounded-md"></div> : 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                }
                            </button>
                            <p className="mt-4 h-5 text-slate-500">{isProcessing ? 'Processing...' : (isRecording ? 'Recording...' : 'Tap to record')}</p>
                        </div>
                    )}
                    {practiceError && <p className="text-red-500 text-sm mt-4">{practiceError}</p>}
                </main>
                {feedback && (
                    <footer className="p-4 border-t flex justify-end">
                        <button onClick={resetPracticeState} className="px-4 py-2 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors">Try Again</button>
                    </footer>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default PracticeView;
