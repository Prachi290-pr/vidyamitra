

// 'use client';

// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { supabase } from '../utils/supabaseClient'; // Make sure this path is correct!
// import { Mic, Zap, CheckCircle, Volume2, Video, Loader2, Sparkles, Award, TrendingUp, BookOpen, ChevronDown } from 'lucide-react';

// // --- Type Definitions ---
// interface SpeechRecognitionInstance { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; abort(): void;
//     onresult: (event: SpeechRecognitionEvent) => void; onerror: (event: SpeechRecognitionErrorEvent) => void; onend: () => void;
// }
// interface SpeechRecognitionConstructor { new (): SpeechRecognitionInstance; }
// interface SpeechRecognitionEvent { results: SpeechRecognitionResultList; }
// interface SpeechRecognitionErrorEvent { error: string; }
// interface SpeechRecognitionResultList { length: number; item(index: number): SpeechRecognitionResult; [index: number]: SpeechRecognitionResult; }
// interface SpeechRecognitionResult { length: number; item(index: number): SpeechRecognitionAlternative; [index: number]: SpeechRecognitionAlternative; isFinal: boolean; }
// interface SpeechRecognitionAlternative { transcript: string; confidence: number; }
// interface CustomWindow extends Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; }

// interface Question { id: number; text: string; }
// interface GradeResult { accuracyScore: number; fluencyScore?: number; feedback: string; }
// interface AnswerRecord { question: string; transcript: string; grade?: GradeResult; }

// // DB Types
// interface Subject { id: number; name: string; icon: string; }
// interface Topic { id: number; title: string; content: string; language: string; }

// // --- TTS Handler ---
// const ttsHandler = {
//     speak: (text: string) => { console.warn("TTS not yet initialized."); },
// };
// const speak = (text: string) => {
//     ttsHandler.speak(text);
// };

// export default function OralPracticePage() {
//     // --- State: Database Data ---
//     const [subjects, setSubjects] = useState<Subject[]>([]);
//     const [topicsList, setTopicsList] = useState<Topic[]>([]);
//     const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
//     const [selectedTopicId, setSelectedTopicId] = useState<string>('');

//     // --- State: App Flow ---
//     const [topicTitle, setTopicTitle] = useState(''); // The topic sent to AI
//     const [topicContent, setTopicContent] = useState(''); // The context for AI
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [finalGrade, setFinalGrade] = useState<GradeResult | null>(null);
//     const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionInstance | null>(null); 
//     const [studentAnswers, setStudentAnswers] = useState<AnswerRecord[]>([]);

//     const videoRef = useRef<HTMLVideoElement>(null); 
//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [cameraActive, setCameraActive] = useState(false);
    
//     const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false); 
//     const [isGenerating, setIsGenerating] = useState(false);

//     const animationVideoRef = useRef<HTMLVideoElement>(null); 
//     const ANIMATION_VIDEO_PATH = '/teacher-talking.mp4'; 

//     // --- 1. Fetch Subjects on Load ---
//     useEffect(() => {
//         const fetchSubjects = async () => {
//             const { data } = await supabase.from('subjects').select('*');
//             if (data) setSubjects(data);
//         };
//         fetchSubjects();
//     }, []);

//     // --- 2. Handle Subject Selection ---
//     const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const subjectId = e.target.value;
//         setSelectedSubjectId(subjectId);
//         setSelectedTopicId(''); // Reset topic
//         setTopicTitle('');
        
//         if (subjectId) {
//             const { data } = await supabase.from('topics').select('*').eq('subject_id', subjectId);
//             if (data) setTopicsList(data);
//         } else {
//             setTopicsList([]);
//         }
//     };

//     // --- 3. Handle Topic Selection ---
//     const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const topicId = e.target.value;
//         setSelectedTopicId(topicId);
        
//         const selectedTopic = topicsList.find(t => t.id.toString() === topicId);
//         if (selectedTopic) {
//             setTopicTitle(selectedTopic.title);
//             setTopicContent(selectedTopic.content);
//         }
//     };

//     // --- Camera Control ---
//     const toggleCamera = useCallback(async (shouldActivate: boolean) => {
//         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//             alert('Your browser does not support media devices.');
//             return;
//         }

//         if (shouldActivate && !stream) {
//             try {
//                 const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 setStream(mediaStream);
//                 if (videoRef.current) videoRef.current.srcObject = mediaStream;
//                 setCameraActive(true);
//             } catch (err) {
//                 console.error(err);
//                 alert('Permission denied or camera not found.');
//                 setCameraActive(false);
//             }
//         } else if (!shouldActivate && stream) {
//             stream.getTracks().forEach(track => track.stop());
//             setStream(null);
//             setCameraActive(false);
//         }
//     }, [stream]);

//     // Cleanup
//     useEffect(() => {
//         return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
//     }, [stream]);
    
//     // --- Final Grading ---
//     const finalizeGrading = useCallback(async (allAnswers: AnswerRecord[]) => {
//         setIsGenerating(true);
//         speak("Please wait. Calculating final grades.");
//         setTranscript("Calculating final results...");
        
//         let totalAccuracy = 0;
//         let totalFluency = 0;
//         let collectiveFeedback = "";
//         const gradedAnswers: AnswerRecord[] = []; 

//         for (const [index, answer] of allAnswers.entries()) {
//             try {
//                 // We send 'topicContent' as context if available, otherwise just question
//                 const response = await fetch('/api/oral-practice/grade', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         question: answer.question,
//                         studentAnswer: answer.transcript,
//                     }),
//                 });
                
//                 if (!response.ok) throw new Error(`Grading failed.`);
//                 const grade: GradeResult = await response.json();
                
//                 totalAccuracy += grade.accuracyScore;
//                 totalFluency += grade.fluencyScore || 0;
//                 collectiveFeedback += `Q${index + 1}: ${grade.feedback}\n`;
//                 gradedAnswers.push({...answer, grade});

//             } catch (error) {
//                 console.error(error);
//                 collectiveFeedback += `Q${index + 1}: Grading Error.\n`;
//             }
//         }

//         const count = allAnswers.length;
//         const avgAccuracy = count > 0 ? Math.round(totalAccuracy / count) : 0;
//         const avgFluency = count > 0 ? Math.round(totalFluency / count) : 0;

//         setStudentAnswers(gradedAnswers);
//         setFinalGrade({
//             accuracyScore: avgAccuracy,
//             fluencyScore: avgFluency,
//             feedback: `Overall Assessment:\n\n${collectiveFeedback}`,
//         });
        
//         setIsGenerating(false);
//         speak(`Practice complete. You scored ${avgAccuracy} percent.`);
//     }, []);

//     // --- Store Answer ---
//     const storeAnswer = useCallback((studentTranscript: string) => {
//         if (!studentTranscript) {
//             setTranscript("Did not recognize speech.");
//             return;
//         }
//         setTranscript(studentTranscript);
        
//         const currentQuestion = questions[currentQuestionIndex]?.text;
//         if (!currentQuestion) return;
        
//         const newRecord: AnswerRecord = { question: currentQuestion, transcript: studentTranscript };
        
//         setStudentAnswers(prev => {
//             const updatedAnswers = [...prev, newRecord];
//             setTimeout(() => {
//                 if (currentQuestionIndex < questions.length - 1) {
//                     setCurrentQuestionIndex(currentQuestionIndex + 1);
//                 } else {
//                     setCurrentQuestionIndex(-2);
//                     finalizeGrading(updatedAnswers); 
//                 }
//             }, 2000); 
//             return updatedAnswers;
//         });
//     }, [currentQuestionIndex, questions, finalizeGrading]);

//     // --- Initialize TTS/STT ---
//     useEffect(() => {
//         const initializeTTS = () => {
//             if (!('speechSynthesis' in window)) return;
//             const loadVoices = () => {
//                 const voices = window.speechSynthesis.getVoices();
//                 if (voices.length === 0) return;
//                 const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('Indian'));
                
//                 ttsHandler.speak = (text: string) => {
//                     window.speechSynthesis.cancel();
//                     const utterance = new SpeechSynthesisUtterance(text);
//                     if (indianVoice) utterance.voice = indianVoice;
//                     utterance.rate = 0.9;
//                     utterance.onstart = () => setIsTeacherSpeaking(true);
//                     utterance.onend = () => setIsTeacherSpeaking(false);
//                     utterance.onerror = () => setIsTeacherSpeaking(false); 
//                     window.speechSynthesis.speak(utterance);
//                 };
//                 window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
//             };
//             loadVoices();
//             window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
//         };
        
//         initializeTTS();
        
//         const customWindow = window as unknown as CustomWindow;
//         if (customWindow.webkitSpeechRecognition || customWindow.SpeechRecognition) {
//             const SpeechRecognitionConstructor = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
//             if (!SpeechRecognitionConstructor) return;

//             const recognitionInstance = new SpeechRecognitionConstructor();
//             recognitionInstance.lang = 'en-IN'; // Default to English-India
//             recognitionInstance.interimResults = false;
//             recognitionInstance.continuous = false;

//             recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
//                 const result = event.results[event.results.length - 1][0].transcript;
//                 recognitionInstance.stop();
//                 setIsListening(false);
//                 storeAnswer(result); 
//             };
//             recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
//                 recognitionInstance.stop();
//                 setIsListening(false);
//                 setTranscript(`Error: ${event.error}`);
//             };
//             recognitionInstance.onend = () => setIsListening(false);
//             setSpeechRecognition(recognitionInstance);
//         } 
//         return () => { window.speechSynthesis.cancel(); };
//     }, [storeAnswer]); 

//     // --- Video Sync ---
//     useEffect(() => {
//         if (animationVideoRef.current) {
//             if (isTeacherSpeaking) animationVideoRef.current.play().catch(() => {});
//             else { animationVideoRef.current.pause(); animationVideoRef.current.currentTime = 0; }
//         }
//     }, [isTeacherSpeaking]);

//     // --- Speak Question ---
//     useEffect(() => {
//         const currentQuestion = questions[currentQuestionIndex]?.text;
//         if (currentQuestion && !isListening) speak(currentQuestion);
//     }, [currentQuestionIndex, questions, isListening]);

//     // --- Generate Questions ---
//     const generateQuestions = useCallback(async () => {
//         if (isListening || !topicTitle) return;
//         if (!cameraActive) {
//             alert("Please activate your camera first.");
//             return;
//         }

//         setIsGenerating(true);
//         setQuestions([]);
//         setCurrentQuestionIndex(-1);
//         setTranscript('Generating questions...');
//         setFinalGrade(null);
//         setStudentAnswers([]);

//         try {
//             const response = await fetch('/api/oral-practice/questions', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ topic: topicTitle }),
//             });

//             if (!response.ok) throw new Error('Failed to generate questions.');
            
//             speak(`Great! Let's talk about ${topicTitle}.`);
//             const data = await response.json();
//             const newQuestions = data.questions.map((q: string, i: number) => ({ id: i, text: q }));
//             setQuestions(newQuestions);
//             setCurrentQuestionIndex(0); 
//             setTranscript(`Ready to start.`);

//         } catch (error) {
//             console.error(error);
//             setTranscript('Error generating questions.');
//         } finally {
//             setIsGenerating(false);
//         }
//     }, [topicTitle, isListening, cameraActive]);

//     const handleRecordToggle = () => {
//         if (!speechRecognition || currentQuestionIndex < 0) return;
//         window.speechSynthesis.cancel();
//         if (isListening) speechRecognition.stop();
//         else {
//             setTranscript('Listening...');
//             setIsListening(true);
//             speechRecognition.start();
//         }
//     };

//     const currentQuestion = questions[currentQuestionIndex]?.text;
//     const isFinished = currentQuestionIndex === -2;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
//             {/* Background Blob */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
//             </div>

//             <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 relative z-10 border border-white/20">
                
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//                         AI Oral Practice
//                     </h1>
//                     <p className="text-gray-600">Select a topic and master your speaking skills.</p>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
//                     {/* LEFT: AI & Camera */}
//                     <div className="lg:col-span-1 flex flex-col space-y-6">
//                         {/* AI Video */}
//                         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-5 text-center">
//                             <div className="relative h-56 w-full rounded-xl overflow-hidden bg-indigo-900/50 shadow-inner mb-3">
//                                 <video ref={animationVideoRef} src={ANIMATION_VIDEO_PATH} loop muted playsInline className={`w-full h-full object-contain transition-opacity duration-300 ${isTeacherSpeaking ? 'opacity-100' : 'opacity-0'}`} />
//                                 {!isTeacherSpeaking && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/20">
//                                         <Zap size={48} className="text-white animate-pulse"/>
//                                         <p className="text-white font-bold mt-2">AI Ready</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <p className="text-white font-bold text-sm">{isTeacherSpeaking ? "🎙️ Speaking..." : "🎧 Listening..."}</p>
//                         </div>
                        
//                         {/* User Camera */}
//                         <div className="bg-gray-800 rounded-2xl shadow-xl p-5">
//                             <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black shadow-inner mb-3">
//                                 <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`} />
//                                 {!cameraActive && <div className="w-full h-full flex items-center justify-center text-gray-500"><Video size={40} /></div>}
//                             </div>
//                             <button onClick={() => toggleCamera(!cameraActive)} className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${cameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
//                                 {cameraActive ? '⏹️ Stop Camera' : '▶️ Start Camera'}
//                             </button>
//                         </div>
//                     </div>

//                     {/* RIGHT: Selection & Questions */}
//                     <div className="lg:col-span-2 flex flex-col justify-between">
//                         <div className="space-y-6">
                            
//                             {/* TOPIC SELECTION DROPDOWNS */}
//                             {!isFinished && currentQuestionIndex < 0 && (
//                                 <div className="bg-indigo-50 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 space-y-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <BookOpen className="text-indigo-600"/>
//                                         <h3 className="font-bold text-lg text-gray-800">Choose Your Topic</h3>
//                                     </div>

//                                     {/* 1. Subject Dropdown */}
//                                     <div className="relative">
//                                         <select 
//                                             value={selectedSubjectId} 
//                                             onChange={handleSubjectChange}
//                                             className="w-full appearance-none bg-white border-2 border-indigo-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
//                                         >
//                                             <option value="">Select a Subject...</option>
//                                             {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
//                                         </select>
//                                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-500">
//                                             <ChevronDown size={20} />
//                                         </div>
//                                     </div>

//                                     {/* 2. Topic Dropdown (Only shows if subject selected) */}
//                                     {selectedSubjectId && (
//                                         <div className="relative animate-in fade-in slide-in-from-top-2">
//                                             <select 
//                                                 value={selectedTopicId} 
//                                                 onChange={handleTopicChange}
//                                                 className="w-full appearance-none bg-white border-2 border-indigo-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
//                                                 disabled={!topicsList.length}
//                                             >
//                                                 <option value="">{topicsList.length > 0 ? "Select a Topic..." : "No topics available"}</option>
//                                                 {topicsList.map(t => <option key={t.id} value={t.id}>{t.title} ({t.standard})</option>)}
//                                             </select>
//                                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-500">
//                                                 <ChevronDown size={20} />
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Start Button */}
//                                     <button
//                                         onClick={generateQuestions}
//                                         disabled={!topicTitle || !cameraActive || isGenerating}
//                                         className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all transform ${
//                                             !topicTitle || !cameraActive || isGenerating
//                                                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                                 : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105'
//                                         }`}
//                                     >
//                                         {isGenerating ? <Loader2 className="animate-spin inline mr-2"/> : '🚀 Start Practice'}
//                                     </button>
//                                     {!cameraActive && <p className="text-center text-xs text-red-500 font-bold">Please enable camera to start.</p>}
//                                 </div>
//                             )}

//                             {/* QUESTION & ANSWER AREA */}
//                             {currentQuestion && (
//                                 <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-200">
//                                     <div className="flex justify-between items-center mb-4">
//                                         <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">Q{currentQuestionIndex + 1} of {questions.length}</span>
//                                         {isListening && <span className="flex items-center text-red-500 font-bold text-xs"><div className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-2"></div>Recording</span>}
//                                     </div>
//                                     <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion}</h2>
                                    
//                                     {transcript && (
//                                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                                             <p className="text-gray-600 italic">"{transcript}"</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* RESULTS AREA */}
//                             {isFinished && finalGrade && (
//                                 <div className="bg-green-50 rounded-2xl p-8 shadow-xl border-4 border-green-400">
//                                     <h2 className="text-3xl font-black text-green-800 mb-4 text-center">🎉 Results</h2>
//                                     <div className="flex justify-center gap-8 mb-6">
//                                         <div className="text-center">
//                                             <p className="text-sm font-bold text-gray-600">Accuracy</p>
//                                             <p className="text-4xl font-black text-green-600">{finalGrade.accuracyScore}%</p>
//                                         </div>
//                                         <div className="text-center">
//                                             <p className="text-sm font-bold text-gray-600">Fluency</p>
//                                             <p className="text-4xl font-black text-blue-600">{finalGrade.fluencyScore}%</p>
//                                         </div>
//                                     </div>
//                                     <div className="bg-white p-4 rounded-xl shadow-sm">
//                                         <p className="font-bold text-gray-800 mb-2">AI Feedback:</p>
//                                         <p className="text-gray-600 text-sm whitespace-pre-wrap">{finalGrade.feedback}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* BIG MIC BUTTON */}
//                         {!isFinished && currentQuestion && (
//                             <div className="mt-8 text-center">
//                                 <button
//                                     onClick={handleRecordToggle}
//                                     className={`p-6 rounded-full shadow-2xl transition-all transform ${isListening ? 'bg-red-500 scale-110 animate-pulse' : 'bg-indigo-600 hover:scale-110'}`}
//                                     disabled={!speechRecognition || isGenerating}
//                                 >
//                                     <Mic size={40} className="text-white" />
//                                 </button>
//                                 <p className="mt-2 text-gray-500 text-sm font-bold">{isListening ? "Listening..." : "Tap to Speak"}</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
            
//             <style jsx>{`
//                 .animate-blob { animation: blob 7s infinite; }
//                 @keyframes blob { 0%{transform: scale(1);} 33%{transform: scale(1.1);} 66%{transform: scale(0.9);} 100%{transform: scale(1);} }
//             `}</style>
//         </div>
//     );
// }





'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Mic, Zap, CheckCircle, Volume2, Video, Loader2, Sparkles, Award, TrendingUp, BookOpen, ChevronDown, MessageSquare, Brain, Target, VolumeX } from 'lucide-react';

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

// DB Types
interface Subject { id: number; name: string; icon: string; }
interface Topic { id: number; title: string; content: string; language: string; }

// --- TTS Handler ---
const ttsHandler = {
    speak: (text: string) => { console.warn("TTS not yet initialized."); },
};
const speak = (text: string) => {
    ttsHandler.speak(text);
};

export default function OralPracticePage() {
    // --- State: Database Data ---
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topicsList, setTopicsList] = useState<Topic[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');

    // --- State: App Flow ---
    const [topicTitle, setTopicTitle] = useState('');
    const [topicContent, setTopicContent] = useState('');
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

    // --- 1. Fetch Subjects on Load ---
    useEffect(() => {
        const fetchSubjects = async () => {
            const { data } = await supabase.from('subjects').select('*');
            if (data) setSubjects(data);
        };
        fetchSubjects();
    }, []);

    // --- 2. Handle Subject Selection ---
    const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subjectId = e.target.value;
        setSelectedSubjectId(subjectId);
        setSelectedTopicId('');
        setTopicTitle('');
        
        if (subjectId) {
            const { data } = await supabase.from('topics').select('*').eq('subject_id', subjectId);
            if (data) setTopicsList(data);
        } else {
            setTopicsList([]);
        }
    };

    // --- 3. Handle Topic Selection ---
    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const topicId = e.target.value;
        setSelectedTopicId(topicId);
        
        const selectedTopic = topicsList.find(t => t.id.toString() === topicId);
        if (selectedTopic) {
            setTopicTitle(selectedTopic.title);
            setTopicContent(selectedTopic.content);
        }
    };

    // --- Camera Control ---
    const toggleCamera = useCallback(async (shouldActivate: boolean) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support media devices.');
            return;
        }

        if (shouldActivate && !stream) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
                setCameraActive(true);
            } catch (err) {
                console.error(err);
                alert('Permission denied or camera not found.');
                setCameraActive(false);
            }
        } else if (!shouldActivate && stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraActive(false);
        }
    }, [stream]);

    // Cleanup
    useEffect(() => {
        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [stream]);
    
    // --- Final Grading ---
    const finalizeGrading = useCallback(async (allAnswers: AnswerRecord[]) => {
        setIsGenerating(true);
        speak("Please wait. Calculating final grades.");
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
                
                if (!response.ok) throw new Error(`Grading failed.`);
                const grade: GradeResult = await response.json();
                
                totalAccuracy += grade.accuracyScore;
                totalFluency += grade.fluencyScore || 0;
                collectiveFeedback += `Q${index + 1}: ${grade.feedback}\n`;
                gradedAnswers.push({...answer, grade});

            } catch (error) {
                console.error(error);
                collectiveFeedback += `Q${index + 1}: Grading Error.\n`;
            }
        }

        const count = allAnswers.length;
        const avgAccuracy = count > 0 ? Math.round(totalAccuracy / count) : 0;
        const avgFluency = count > 0 ? Math.round(totalFluency / count) : 0;

        setStudentAnswers(gradedAnswers);
        setFinalGrade({
            accuracyScore: avgAccuracy,
            fluencyScore: avgFluency,
            feedback: `Overall Assessment:\n\n${collectiveFeedback}`,
        });
        
        setIsGenerating(false);
        speak(`Practice complete. You scored ${avgAccuracy} percent.`);
    }, []);

    // --- Store Answer ---
    const storeAnswer = useCallback((studentTranscript: string) => {
        if (!studentTranscript) {
            setTranscript("Did not recognize speech.");
            return;
        }
        setTranscript(studentTranscript);
        
        const currentQuestion = questions[currentQuestionIndex]?.text;
        if (!currentQuestion) return;
        
        const newRecord: AnswerRecord = { question: currentQuestion, transcript: studentTranscript };
        
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

    // --- Initialize TTS/STT ---
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
                    if (indianVoice) utterance.voice = indianVoice;
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
        if (customWindow.webkitSpeechRecognition || customWindow.SpeechRecognition) {
            const SpeechRecognitionConstructor = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
            if (!SpeechRecognitionConstructor) return;

            const recognitionInstance = new SpeechRecognitionConstructor();
            recognitionInstance.lang = 'en-IN';
            recognitionInstance.interimResults = false;
            recognitionInstance.continuous = false;

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const result = event.results[event.results.length - 1][0].transcript;
                recognitionInstance.stop();
                setIsListening(false);
                storeAnswer(result);
            };
            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                recognitionInstance.stop();
                setIsListening(false);
                setTranscript(`Error: ${event.error}`);
            };
            recognitionInstance.onend = () => setIsListening(false);
            setSpeechRecognition(recognitionInstance);
        } 
        return () => { window.speechSynthesis.cancel(); };
    }, [storeAnswer]);

    // --- Video Sync ---
    useEffect(() => {
        if (animationVideoRef.current) {
            if (isTeacherSpeaking) animationVideoRef.current.play().catch(() => {});
            else { animationVideoRef.current.pause(); animationVideoRef.current.currentTime = 0; }
        }
    }, [isTeacherSpeaking]);

    // --- Speak Question ---
    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex]?.text;
        if (currentQuestion && !isListening) speak(currentQuestion);
    }, [currentQuestionIndex, questions, isListening]);

    // --- Generate Questions ---
    const generateQuestions = useCallback(async () => {
        if (isListening || !topicTitle) return;
        if (!cameraActive) {
            alert("Please activate your camera first.");
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
                body: JSON.stringify({ topic: topicTitle }),
            });

            if (!response.ok) throw new Error('Failed to generate questions.');
            
            speak(`Great! Let's talk about ${topicTitle}.`);
            const data = await response.json();
            const newQuestions = data.questions.map((q: string, i: number) => ({ id: i, text: q }));
            setQuestions(newQuestions);
            setCurrentQuestionIndex(0);
            setTranscript(`Ready to start.`);

        } catch (error) {
            console.error(error);
            setTranscript('Error generating questions.');
        } finally {
            setIsGenerating(false);
        }
    }, [topicTitle, isListening, cameraActive]);

    const handleRecordToggle = () => {
        if (!speechRecognition || currentQuestionIndex < 0) return;
        window.speechSynthesis.cancel();
        if (isListening) speechRecognition.stop();
        else {
            setTranscript('Listening...');
            setIsListening(true);
            speechRecognition.start();
        }
    };

    const currentQuestion = questions[currentQuestionIndex]?.text;
    const isFinished = currentQuestionIndex === -2;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-6xl glass-panel rounded-3xl p-6 md:p-10 relative z-10 border border-border">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <MessageSquare className="w-4 h-4" />
                        AI-Powered Oral Practice
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2">
                        <span className="text-gradient">Practice Speaking</span>
                    </h1>
                    <p className="text-muted-foreground">Select a topic and master your speaking skills with AI feedback</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: AI & Camera */}
                    <div className="lg:col-span-1 flex flex-col space-y-6">
                        {/* AI Video Panel */}
                        <div className="glass-panel rounded-2xl p-5 text-center border border-border hover:border-primary/30 hover:glow-effect transition-all">
                            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 mb-3 shadow-inner">
                                <video ref={animationVideoRef} src={ANIMATION_VIDEO_PATH} loop muted playsInline className={`w-full h-full object-contain transition-opacity duration-300 ${isTeacherSpeaking ? 'opacity-100' : 'opacity-0'}`} />
                                {!isTeacherSpeaking && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3">
                                            <Brain className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="font-bold text-muted-foreground">AI Ready</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isTeacherSpeaking ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`}></div>
                                <p className="text-sm font-semibold">
                                    {isTeacherSpeaking ? "🎙️ Speaking Question..." : "🎧 Ready to Listen"}
                                </p>
                            </div>
                        </div>
                        
                        {/* User Camera Panel */}
                        <div className="glass-panel rounded-2xl p-5 border border-border">
                            <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gradient-to-br from-card to-card/50 mb-3 shadow-inner">
                                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`} />
                                {!cameraActive && (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <Video className="w-12 h-12 mb-2 opacity-50" />
                                        <p className="text-sm">Camera Off</p>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => toggleCamera(!cameraActive)} 
                                className={`w-full py-3 rounded-xl font-bold transition-all ${
                                    cameraActive 
                                        ? 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20' 
                                        : 'btn-gradient hover:scale-105'
                                }`}
                            >
                                {cameraActive ? '⏹️ Stop Camera' : '▶️ Start Camera'}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="glass-panel rounded-2xl p-4 border border-border">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-lg bg-muted/30">
                                    <div className="text-2xl font-bold gradient-text mb-1">{questions.length}</div>
                                    <div className="text-xs text-muted-foreground">Total Questions</div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/30">
                                    <div className="text-2xl font-bold gradient-text mb-1">
                                        {currentQuestionIndex >= 0 ? currentQuestionIndex : 0}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Selection & Questions */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <div className="space-y-6">
                            
                            {/* TOPIC SELECTION DROPDOWNS */}
                            {!isFinished && currentQuestionIndex < 0 && (
                                <div className="glass-panel rounded-2xl p-6 space-y-4 border border-border hover:glow-effect transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Choose Your Topic</h3>
                                            <p className="text-sm text-muted-foreground">Select a subject and topic to practice</p>
                                        </div>
                                    </div>

                                    {/* Subject Dropdown */}
                                    <div className="relative">
                                        <select 
                                            value={selectedSubjectId} 
                                            onChange={handleSubjectChange}
                                            className="w-full appearance-none glass-panel text-foreground py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 border border-border"
                                        >
                                            <option value="" className="bg-card">Select a Subject...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id} className="bg-card">{s.icon} {s.name}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>

                                    {/* Topic Dropdown */}
                                    {selectedSubjectId && (
                                        <div className="relative animate-in fade-in slide-in-from-top-2">
                                            <select 
                                                value={selectedTopicId} 
                                                onChange={handleTopicChange}
                                                className="w-full appearance-none glass-panel text-foreground py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 border border-border"
                                                disabled={!topicsList.length}
                                            >
                                                <option value="" className="bg-card">
                                                    {topicsList.length > 0 ? "Select a Topic..." : "No topics available"}
                                                </option>
                                                {topicsList.map(t => (
                                                    <option key={t.id} value={t.id} className="bg-card">
                                                        {t.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Start Button */}
                                    <button
                                        onClick={generateQuestions}
                                        disabled={!topicTitle || !cameraActive || isGenerating}
                                        className={`w-full py-4 font-bold rounded-xl transition-all transform ${
                                            !topicTitle || !cameraActive || isGenerating
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'btn-gradient hover:scale-105'
                                        }`}
                                    >
                                        {isGenerating ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="animate-spin w-5 h-5" />
                                                Generating Questions...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Sparkles className="w-5 h-5" />
                                                Start Practice Session
                                            </span>
                                        )}
                                    </button>
                                    {!cameraActive && (
                                        <p className="text-center text-sm text-destructive font-medium flex items-center justify-center gap-2">
                                            <Video className="w-4 h-4" />
                                            Please enable camera to start
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* QUESTION & ANSWER AREA */}
                            {currentQuestion && (
                                <div className="glass-panel rounded-2xl p-8 border border-border hover:border-primary/30 hover:glow-effect transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 px-4 py-2 rounded-xl border border-primary/20">
                                                <span className="text-sm font-bold gradient-text">
                                                    Q{currentQuestionIndex + 1} of {questions.length}
                                                </span>
                                            </div>
                                            {isListening && (
                                                <span className="flex items-center gap-2 text-accent font-bold text-sm">
                                                    <div className="w-2 h-2 bg-accent rounded-full animate-ping"></div>
                                                    Recording
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium">
                                            Speak clearly into your microphone
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-8 leading-relaxed">{currentQuestion}</h2>
                                    
                                    {transcript && (
                                        <div className="glass-panel p-6 rounded-xl border border-border/50">
                                            <p className="text-muted-foreground text-sm font-semibold mb-2">Your Response:</p>
                                            <p className="text-foreground text-lg italic">"{transcript}"</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RESULTS AREA */}
                            {isFinished && finalGrade && (
                                <div className="glass-panel rounded-2xl p-8 border-2 border-accent/30 glow-effect">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-green-500/20 mb-4">
                                            <Award className="w-8 h-8 text-accent" />
                                        </div>
                                        <h2 className="text-3xl font-black mb-2">
                                            <span className="text-gradient">Practice Complete!</span>
                                        </h2>
                                        <p className="text-muted-foreground">Your AI assessment results</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="glass-panel p-6 rounded-xl border border-primary/20 text-center">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                                                <Target className="w-6 h-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold text-muted-foreground mb-2">Accuracy</p>
                                            <p className="text-4xl font-black gradient-text">{finalGrade.accuracyScore}%</p>
                                        </div>
                                        <div className="glass-panel p-6 rounded-xl border border-secondary/20 text-center">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mx-auto mb-4">
                                                <TrendingUp className="w-6 h-6 text-secondary" />
                                            </div>
                                            <p className="text-sm font-bold text-muted-foreground mb-2">Fluency</p>
                                            <p className="text-4xl font-black gradient-text">{finalGrade.fluencyScore}%</p>
                                        </div>
                                    </div>
                                    <div className="glass-panel p-6 rounded-xl border border-border">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-primary" />
                                            AI Feedback
                                        </h3>
                                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                                            {finalGrade.feedback}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MICROPHONE BUTTON */}
                        {!isFinished && currentQuestion && (
                            <div className="mt-8 text-center">
                                <div className="relative">
                                    <button
                                        onClick={handleRecordToggle}
                                        className={`relative w-20 h-20 rounded-full shadow-2xl transition-all transform ${
                                            isListening 
                                                ? 'bg-gradient-to-br from-destructive to-rose-600 scale-110 animate-pulse' 
                                                : 'btn-gradient hover:scale-110'
                                        }`}
                                        disabled={!speechRecognition || isGenerating}
                                    >
                                        {isListening ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 rounded-full bg-white/20 animate-ping"></div>
                                                <VolumeX className="w-10 h-10 text-white relative z-10" />
                                            </div>
                                        ) : (
                                            <Mic className="w-10 h-10 text-white" />
                                        )}
                                    </button>
                                    <div className="mt-4 text-sm font-semibold">
                                        {isListening ? (
                                            <span className="text-accent flex items-center justify-center gap-2">
                                                Listening... Speak now
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">Click microphone to answer</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}