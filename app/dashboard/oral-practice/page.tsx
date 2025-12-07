'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, Zap, CheckCircle, Volume2, Video, Loader2, Sparkles, Award, TrendingUp } from 'lucide-react';

// --- Type Definitions ---
interface SpeechRecognitionInstance { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void; onerror: (event: SpeechRecognitionErrorEvent) => void; onend: () => void;
}
interface SpeechRecognitionConstructor { new (): SpeechRecognitionInstance; }
interface SpeechRecognitionEvent { results: SpeechRecognitionResultList; }
interface SpeechRecognitionErrorEvent { error: string; }
interface SpeechRecognitionResultList { length: number; item(index: number): SpeechRecognitionResult; [index: number]: SpeechRecognitionResult; }
interface SpeechRecognitionResult { length: number; item(index: number): SpeechRecognitionAlternative; [index: number]: SpeechRecognitionAlternative; isFinal: boolean; }
interface SpeechRecognitionAlternative { transcript: string; confidence: number; }
interface CustomWindow extends Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; }

interface Question { id: number; text: string; }
interface GradeResult { accuracyScore: number; fluencyScore?: number; feedback: string; }
interface AnswerRecord { question: string; transcript: string; grade?: GradeResult; }

// --- TTS Handler State & Speak Wrapper ---
const ttsHandler = {
    speak: (text: string) => { console.warn("TTS not yet initialized."); },
};
const speak = (text: string) => {
    ttsHandler.speak(text);
};

// --- Main Component ---
export default function OralPracticePage() {
    // --- State Declarations ---
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [finalGrade, setFinalGrade] = useState<GradeResult | null>(null);
    const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionInstance | null>(null); 
    const [studentAnswers, setStudentAnswers] = useState<AnswerRecord[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null); 
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    
    const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false); 
    const [isGenerating, setIsGenerating] = useState(false);

    const animationVideoRef = useRef<HTMLVideoElement>(null); 
    const ANIMATION_VIDEO_PATH = '/teacher-talking.mp4'; 

    // --- Camera Control ---
    const toggleCamera = useCallback(async (shouldActivate: boolean) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support media devices (camera/mic).');
            return;
        }

        if (shouldActivate && !stream) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setCameraActive(true);
            } catch (err) {
                console.error('Error accessing camera/microphone:', err);
                alert('Permission denied or camera not found.');
                setCameraActive(false);
            }
        } else if (!shouldActivate && stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraActive(false);
        }
    }, [stream]);

    // --- Cleanup Effect ---
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);
    
    // --- Final Grading ---
    const finalizeGrading = useCallback(async (allAnswers: AnswerRecord[]) => {
        setIsGenerating(true);
        speak("Please wait. Calculating final grades and collective feedback.");
        setTranscript("Calculating final results...");
        
        let totalAccuracy = 0;
        let totalFluency = 0;
        let collectiveFeedback = "";
        const gradedAnswers: AnswerRecord[] = []; 

        for (const [index, answer] of allAnswers.entries()) {
            try {
                const response = await fetch('/api/oral-practice/grade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: answer.question,
                        studentAnswer: answer.transcript,
                    }),
                });
                
                if (!response.ok) throw new Error(`Grading failed for question ${index + 1}.`);
                
                const grade: GradeResult = await response.json();
                
                totalAccuracy += grade.accuracyScore;
                totalFluency += grade.fluencyScore || 0;
                collectiveFeedback += `Q${index + 1}: ${grade.feedback}\n`;
                
                gradedAnswers.push({...answer, grade});

            } catch (error) {
                console.error(`Error grading question ${index + 1}:`, error);
                totalAccuracy += 0;
                collectiveFeedback += `Q${index + 1}: Could not grade due to API error.\n`;
            }
        }

        const count = allAnswers.length;
        const avgAccuracy = Math.round(totalAccuracy / count);
        const avgFluency = Math.round(totalFluency / count);

        setStudentAnswers(gradedAnswers);
        setFinalGrade({
            accuracyScore: avgAccuracy,
            fluencyScore: avgFluency,
            feedback: `Overall Assessment:\n\n${collectiveFeedback}`,
        });
        
        setIsGenerating(false);
        speak(`Final practice complete. Your average accuracy is ${avgAccuracy} percent.`);
    }, []);

    // --- Store Answer ---
    const storeAnswer = useCallback((studentTranscript: string) => {
        if (!studentTranscript) {
            setTranscript("Did not recognize any speech.");
            return;
        }
        
        setTranscript(studentTranscript);
        
        const currentQuestion = questions[currentQuestionIndex]?.text;
        if (!currentQuestion) return;
        
        const newRecord: AnswerRecord = {
            question: currentQuestion,
            transcript: studentTranscript,
        };
        
        setStudentAnswers(prev => {
            const updatedAnswers = [...prev, newRecord];
            
            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    setCurrentQuestionIndex(-2);
                    finalizeGrading(updatedAnswers); 
                }
            }, 2000); 

            return updatedAnswers;
        });
    }, [currentQuestionIndex, questions, finalizeGrading]);

    // --- Initialize TTS and STT ---
    useEffect(() => {
        const initializeTTS = () => {
            if (!('speechSynthesis' in window)) return;
            
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length === 0) return;

                const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('Indian'));
                
                ttsHandler.speak = (text: string) => {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(text);
                    
                    if (indianVoice) {
                        utterance.voice = indianVoice;
                    }
                    utterance.lang = 'en-IN'; 
                    utterance.rate = 0.9;
                    
                    utterance.onstart = () => setIsTeacherSpeaking(true);
                    utterance.onend = () => setIsTeacherSpeaking(false);
                    utterance.onerror = () => setIsTeacherSpeaking(false); 

                    window.speechSynthesis.speak(utterance);
                };
                
                window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
            };

            loadVoices();
            window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        };
        
        initializeTTS();
        
        const customWindow = window as unknown as CustomWindow;
        let recognitionInstance: SpeechRecognitionInstance | null = null; 

        if (customWindow.webkitSpeechRecognition || customWindow.SpeechRecognition) {
            const SpeechRecognitionConstructor = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
            
            if (!SpeechRecognitionConstructor) return;

            recognitionInstance = new SpeechRecognitionConstructor();
            
            recognitionInstance.lang = 'hi-IN'; 
            recognitionInstance.interimResults = false;
            recognitionInstance.continuous = false;

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const result = event.results[event.results.length - 1][0].transcript;
                recognitionInstance?.stop();
                setIsListening(false);
                storeAnswer(result); 
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech Recognition Error:', event.error);
                recognitionInstance?.stop();
                setIsListening(false);
                setTranscript(`Error: ${event.error}. Try again.`);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setSpeechRecognition(recognitionInstance);
        } 
        
        return () => {
            if (recognitionInstance) { 
                recognitionInstance.stop();
            }
            window.speechSynthesis.cancel(); 
        };
    }, [storeAnswer]); 

    // --- Video Playback Management ---
    useEffect(() => {
        if (animationVideoRef.current) {
            if (isTeacherSpeaking) {
                animationVideoRef.current.play().catch(e => console.warn("Video playback failed:", e));
            } else {
                animationVideoRef.current.pause();
                animationVideoRef.current.currentTime = 0; 
            }
        }
    }, [isTeacherSpeaking]);

    // --- Speak New Question ---
    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex]?.text;
        
        if (currentQuestion && !isListening) {
            speak(currentQuestion);
        }
    }, [currentQuestionIndex, questions, isListening]);

    // --- Generate Questions ---
    const generateQuestions = useCallback(async () => {
        if (isListening) return;
        
        if (!cameraActive) {
            alert("Please activate your camera and microphone before starting the oral practice.");
            return;
        }

        setIsGenerating(true);
        setQuestions([]);
        setCurrentQuestionIndex(-1);
        setTranscript('Generating questions...');
        setFinalGrade(null);
        setStudentAnswers([]);

        try {
            const response = await fetch('/api/oral-practice/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error('Failed to generate questions.');
            
            speak("Questions generated. Starting practice now.");

            const data = await response.json();
            const newQuestions = data.questions.map((q: string, i: number) => ({ id: i, text: q }));
            setQuestions(newQuestions);
            setCurrentQuestionIndex(0); 
            setTranscript(`Question 1 of ${newQuestions.length} ready.`);

        } catch (error) {
            console.error('Error generating questions:', error);
            setTranscript('Could not generate questions. Check topic and server logs.');
        } finally {
            setIsGenerating(false);
        }
    }, [topic, isListening, cameraActive]);

    // --- Handle Recording Toggle ---
    const handleRecordToggle = () => {
        if (!speechRecognition || currentQuestionIndex < 0) return;

        window.speechSynthesis.cancel();

        if (isListening) {
            speechRecognition.stop();
        } else {
            setTranscript('Listening... Speak now!');
            setFinalGrade(null); 
            setIsListening(true);
            speechRecognition.start();
        }
    };

    const currentQuestion = questions[currentQuestionIndex]?.text;
    const isFinished = currentQuestionIndex === -2;

    // --- Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 relative z-10 border border-white/20">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        AI Oral Practice
                    </h1>
                    <p className="text-gray-600 text-lg">Master your speaking skills with AI-powered feedback</p>
                </div>

                {/* Progress Bar */}
                {questions.length > 0 && currentQuestionIndex >= 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">Progress</span>
                            <span className="text-sm font-bold text-indigo-600">
                                {currentQuestionIndex + 1} / {questions.length}
                            </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: AI Teacher and Student Video */}
                    <div className="lg:col-span-1 flex flex-col space-y-6">
                        
                        {/* AI Teacher Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-5 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <Zap className="text-yellow-300 mr-2" size={24} />
                                <h3 className="text-lg font-bold text-white">AI Teacher</h3>
                            </div>
                            
                            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-indigo-900/50 shadow-inner mb-3">
                                <video 
                                    ref={animationVideoRef}
                                    src={ANIMATION_VIDEO_PATH}
                                    loop
                                    muted 
                                    playsInline
                                    className={`w-full h-full object-contain transition-all duration-500 ${isTeacherSpeaking ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}`}
                                />
                                
                                {!isTeacherSpeaking && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-400/20 to-purple-500/20 backdrop-blur-sm">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                                            <Zap size={48} className="text-white relative z-10 animate-pulse"/>
                                        </div>
                                        <p className="text-white font-bold mt-4 text-lg">Ready to Ask</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                isTeacherSpeaking 
                                    ? 'bg-yellow-400 text-yellow-900' 
                                    : 'bg-white/20 text-white'
                            }`}>
                                <p className="font-bold text-sm">
                                    {isTeacherSpeaking ? "🎙️ Speaking..." : "🎧 Your Turn!"}
                                </p>
                            </div>
                        </div>
                        
                        {/* Student Camera Card */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-5 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <Video className="text-red-400 mr-2" size={20} />
                                <h3 className="text-white font-bold">Your Video</h3>
                            </div>
                            
                            <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black shadow-inner mb-3">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className={`w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`}
                                />
                                {!cameraActive && (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                        <Video size={40} className="mb-2 opacity-30" />
                                        <p className="text-sm">Camera Off</p>
                                    </div>
                                )}
                                {cameraActive && (
                                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="font-bold">LIVE</span>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={() => toggleCamera(!cameraActive)}
                                className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                    cameraActive
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                }`}
                            >
                                {cameraActive ? '⏹️ Stop Camera' : '▶️ Start Camera'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        
                        <div className="space-y-6">
                            {/* Topic Input Section */}
                            {!isFinished && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border-2 border-indigo-200">
                                    <label htmlFor="topic" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        📚 Practice Topic
                                    </label>
                                    <div className="flex space-x-3">
                                        <input
                                            id="topic"
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="flex-grow px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm text-lg"
                                            placeholder="e.g., Photosynthesis, Indian History..."
                                            disabled={isGenerating || currentQuestionIndex >= 0}
                                        />
                                        <button
                                            onClick={generateQuestions}
                                            disabled={!topic || isListening || currentQuestionIndex >= 0 || !cameraActive || isGenerating}
                                            className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 transform shadow-lg ${
                                                isGenerating || !topic || !cameraActive || currentQuestionIndex >= 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl'
                                            }`}
                                        >
                                            {isGenerating ? (
                                                <Loader2 className="inline-block animate-spin" size={24} />
                                            ) : '🚀 Start Practice'}
                                        </button>
                                    </div>
                                    {!cameraActive && (
                                        <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ Please enable camera first</p>
                                    )}
                                </div>
                            )}

                            {/* Question Display */}
                            {currentQuestion && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-200 transform hover:shadow-2xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                {currentQuestionIndex + 1}
                                            </div>
                                            <span className="text-lg font-bold text-gray-700">
                                                Question {currentQuestionIndex + 1} of {questions.length}
                                            </span>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                            isListening 
                                                ? 'bg-red-100 text-red-700 animate-pulse' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {isListening ? '🎤 Listening' : '✓ Ready'}
                                        </span>
                                    </div>
                                    
                                    <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-4">
                                        {currentQuestion}
                                    </p>
                                    
                                    <button 
                                        onClick={() => speak(currentQuestion)} 
                                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-bold transition-all duration-300 hover:scale-105"
                                    >
                                        <Volume2 size={20} />
                                        <span>🔊 Listen Again</span>
                                    </button>
                                </div>
                            )}

                            {/* Transcript Display */}
                            {transcript && !isFinished && (
                                <div className={`rounded-2xl p-6 transition-all duration-500 shadow-lg transform hover:scale-105 ${
                                    isListening 
                                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400' 
                                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300'
                                }`}>
                                    <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        {isListening ? '🎤' : '📝'} Your Response:
                                    </h3>
                                    <p className="text-xl font-medium text-gray-900 italic">
                                        &quot;{transcript}&quot;
                                    </p>
                                </div>
                            )}

                            {/* Final Grade Display */}
                            {isFinished && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-2xl border-4 border-green-400 transform hover:scale-105 transition-all duration-500">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4 shadow-xl animate-bounce">
                                            <Award className="text-white" size={40} />
                                        </div>
                                        <h2 className="text-4xl font-black text-green-800 mb-2">
                                            🎉 Practice Complete!
                                        </h2>
                                        <p className="text-gray-600 text-lg">Here your performance report</p>
                                    </div>
                                    
                                    {finalGrade ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-6 mb-6">
                                                <div className="bg-white rounded-xl p-6 shadow-lg text-center transform hover:scale-105 transition-all">
                                                    <TrendingUp className="mx-auto mb-2 text-green-600" size={32} />
                                                    <p className="text-sm font-bold text-gray-600 mb-1">Accuracy</p>
                                                    <p className={`text-5xl font-black ${
                                                        finalGrade.accuracyScore > 70 ? 'text-green-600' : 'text-orange-600'
                                                    }`}>
                                                        {finalGrade.accuracyScore}%
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-xl p-6 shadow-lg text-center transform hover:scale-105 transition-all">
                                                    <Sparkles className="mx-auto mb-2 text-blue-600" size={32} />
                                                    <p className="text-sm font-bold text-gray-600 mb-1">Fluency</p>
                                                    <p className="text-5xl font-black text-blue-600">
                                                        {finalGrade.fluencyScore}%
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                                    💬 Feedback:
                                                </h3>
                                                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                    {finalGrade.feedback}
                                                </pre>
                                            </div>
                                            
                                            <details className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all">
                                                <summary className="font-bold text-indigo-700 hover:text-indigo-900 text-lg">
                                                    📋 View Individual Answers
                                                </summary>
                                                <div className="mt-4 space-y-3">
                                                    {studentAnswers.map((answer, index) => (
                                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                                            <p className="font-bold text-gray-800 mb-1">Q{index + 1}: {answer.question}</p>
                                                            <p className="text-sm italic text-gray-600 mb-2">&quot;{answer.transcript}&quot;</p>
                                                            {answer.grade && (
                                                                <p className="text-sm font-bold text-green-700">
                                                                    ✓ Score: {answer.grade.accuracyScore}%
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Loader2 className="mx-auto animate-spin text-green-600 mb-4" size={48} />
                                            <p className="text-gray-700 font-bold text-lg">Analyzing your responses...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Microphone Button - Duolingo Style */}
                        {!isFinished && currentQuestion && (
                            <div className="mt-8 pt-6 border-t-2 border-gray-200">
                                <div className="text-center">
                                    <button
                                        onClick={handleRecordToggle}
                                        className={`relative p-6 rounded-full transition-all duration-300 transform ${
                                            isListening
                                                ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110 shadow-2xl animate-pulse-glow'
                                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110 shadow-xl hover:shadow-2xl'
                                        } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
                                        disabled={!currentQuestion || !speechRecognition || isGenerating}
                                        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
                                    >
                                        {isListening && (
                                            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                                        )}
                                        <Mic size={48} className="relative z-10" />
                                    </button>
                                    
                                    <p className="mt-4 text-lg font-bold text-gray-700">
                                        {isGenerating ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                AI is grading your answer...
                                            </span>
                                        ) : isListening ? (
                                            <span className="text-red-600 animate-pulse">
                                                🎤 Recording... Speak clearly!
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">
                                                👆 Tap the mic when ready to answer
                                            </span>
                                        )}
                                    </p>
                                    
                                    {!isListening && !isGenerating && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Press and speak your answer clearly
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                @keyframes pulse-glow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.5),
                                    0 0 40px rgba(239, 68, 68, 0.3),
                                    0 0 60px rgba(239, 68, 68, 0.2);
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(239, 68, 68, 0.7),
                                    0 0 60px rgba(239, 68, 68, 0.5),
                                    0 0 90px rgba(239, 68, 68, 0.3);
                    }
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}