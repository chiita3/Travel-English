
import { GoogleGenAI, Type } from '@google/genai';
import { PronunciationFeedback } from './types';

export async function getPronunciationFeedback(modelPhrase: string, userPhrase: string): Promise<PronunciationFeedback | null> {
    if (!userPhrase.trim()) {
        return { 
            score: 0, 
            words: modelPhrase.split(' ').map(w => ({ word: w, isCorrect: false })),
            advice: 'マイクに向かって話してみてください。'
        };
    }
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Analyze the phonetic accuracy of a user's English pronunciation.
            The user was expected to say something like: "${modelPhrase}"
            The user actually said: "${userPhrase}"

            Compare the user's phrase to the model phrase. Provide a score from 0 to 100 on pronunciation accuracy. 
            Also, provide a word-by-word analysis of the user's phrase.
            Finally, provide a short, actionable tip in Japanese for how the user can improve their pronunciation for the next try. Focus on the words they got wrong.

            Respond ONLY with a JSON object in the following format:
            {
                "score": <number>,
                "words": [{ "word": "<string>", "isCorrect": <boolean> }],
                "advice": "<string in Japanese>"
            }
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        words: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    word: { type: Type.STRING },
                                    isCorrect: { type: Type.BOOLEAN },
                                }
                            }
                        },
                        advice: { type: Type.STRING }
                    }
                }
            }
        });

        const feedback = JSON.parse(response.text);
        return feedback;
    } catch (error) {
        console.error('Error getting pronunciation feedback:', error);
        return null;
    }
}

export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Audio } },
                    { text: "Transcribe the audio accurately." }
                ]
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return '';
    }
}
