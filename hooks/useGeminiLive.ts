
import { useState, useCallback, useRef, useEffect } from 'react';
// Fix: Removed LiveSession from import as it is not an exported member.
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';

// --- Audio Utility Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): GenaiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

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


interface GeminiLiveHookProps {
  voice: string;
  systemInstruction: string;
}

interface Turn {
    text: string;
    isFinal: boolean;
}

export const useGeminiLive = ({ voice, systemInstruction }: GeminiLiveHookProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [userTurn, setUserTurn] = useState<Turn | null>(null);
  const [modelTurn, setModelTurn] = useState<Turn | null>(null);

  // Fix: Changed LiveSession to any since it's not an exported type.
  const sessionRef = useRef<any | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if(inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
    }
    if(outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close();
    }
    for (const source of sourcesRef.current.values()) {
        source.stop();
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsConnected(false);
  }, []);

  const startSession = useCallback(async () => {
    if (sessionRef.current || !voice || !systemInstruction) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const handleMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription) {
            currentInputTranscription.current += message.serverContent.inputTranscription.text;
            setUserTurn({ text: currentInputTranscription.current, isFinal: false});
        }
        if (message.serverContent?.outputTranscription) {
            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            setModelTurn({ text: currentOutputTranscription.current, isFinal: false });
        }
        if(message.serverContent?.turnComplete){
            setUserTurn({ text: currentInputTranscription.current, isFinal: true });
            setModelTurn({ text: currentOutputTranscription.current, isFinal: true });
            currentInputTranscription.current = '';
            currentOutputTranscription.current = '';
        }
        
        const interrupted = message.serverContent?.interrupted;
        if (interrupted) {
          for (const source of sourcesRef.current.values()) {
            source.stop();
            sourcesRef.current.delete(source);
          }
          nextStartTimeRef.current = 0;
        }

        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
        if (audioData && outputAudioContextRef.current) {
            const outputAudioContext = outputAudioContextRef.current;
            nextStartTimeRef.current = Math.max(
              nextStartTimeRef.current,
              outputAudioContext.currentTime,
            );
            const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.addEventListener('ended', () => {
              sourcesRef.current.delete(source);
            });
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
        }
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => setIsConnected(true),
          onmessage: handleMessage,
          onerror: (e: ErrorEvent) => {
            console.error(e);
            setError(new Error(e.message));
            stopSession();
          },
          onclose: (e: CloseEvent) => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          systemInstruction: systemInstruction,
        },
      });

      sessionRef.current = await sessionPromise;

      inputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
      };

      source.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);

    } catch (err: any) {
      console.error(err);
      setError(err);
      stopSession();
    }
  }, [voice, systemInstruction, stopSession]);
  
  useEffect(() => {
    return () => {
        stopSession();
    };
  }, [stopSession]);

  return { startSession, stopSession, isConnected, error, userTurn, modelTurn };
};
