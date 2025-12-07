// lib/gemini.ts
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client. It automatically uses the GEMINI_API_KEY from .env.local
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = 'gemini-2.5-flash';

// Define the expected structure for the grading API call
interface GradingOutput {
  accuracyScore: number;
  fluencyScore: number;
  feedback: string;
}

/**
 * Generates 3 short, DIVERSE viva questions for a given topic using structured output.
 */
export async function generateVivaQuestions(topic: string): Promise<string[]> {
  const prompt = `
    You are an expert academic tutor. Generate exactly 3 short, factual viva questions suitable for a student studying "${topic}". 
    CRITICAL REQUIREMENT: Each of the 3 questions MUST be a different type:
    1. A definition or factual recall question (e.g., "What is X?").
    2. A conceptual or explanatory question (e.g., "Explain how Y works" or "Describe the role of Z").
    3. A comparative or analytical question (e.g., "Compare X and Y" or "What is the significance of Z?").
    The questions must be diverse and not cover the same sub-topic.
  `;

  // Diverse fallback questions for when API quota is exceeded or fails
  const fallbackQuestions = [
    `List three key characteristics of ${topic}.`,
    `Explain the process of how ${topic} affects society/the environment.`,
    `Why is understanding ${topic} considered important in its field?`
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: { type: 'string' },
              description: 'An array of exactly 3 diverse factual viva questions.',
            }
          },
          required: ['questions'],
        }
      }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      console.warn("Gemini returned empty response, using diverse fallback.");
      return fallbackQuestions; 
    }
    
    const result = JSON.parse(jsonText);

    const generatedQuestions = (result.questions || []).slice(0, 3);
    return generatedQuestions.length > 0 ? generatedQuestions : fallbackQuestions;

  } catch (error) {
    console.error('Gemini API Error generating questions:', error);
    return fallbackQuestions;
  }
}

/**
 * Grades a student's transcribed answer against a specific question using structured output.
 * FIX: Enhanced prompt for robust scoring and non-zero accuracy.
 */
export async function gradeStudentAnswer(
  question: string,
  studentAnswer: string
): Promise<GradingOutput> {
  // Enhanced Prompt
  const prompt = `
    You are a multilingual AI grading assistant. You are grading a student's answer transcribed from speech, which may contain regional accents or a mix of English and local languages (Hinglish/Marathi).
    
    CRITICAL SCORING LOGIC:
    1. **ACCURACY Score (0-100):** This score MUST be based solely on factual content relevant to the question. A score below 10 should ONLY be given if the answer is completely blank, nonsensical, or 100% wrong. For partially correct answers, score 40-70. For largely correct answers, score 70-100.
    2. **FLUENCY Score (0-100):** Score based on the quality of the transcript (length, completeness). Assume some minor transcription errors are the STT engine's fault. Score highly (70-100) unless the student's response was clearly too short or incoherent.
    3. **FEEDBACK:** Provide 1-2 sentences of constructive feedback.

    ---
    QUESTION: "${question}"
    STUDENT'S TRANSCRIPT: "${studentAnswer}"
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Enforce the exact output structure
        responseSchema: {
          type: 'object',
          properties: {
            accuracyScore: { type: 'number', description: 'Factual accuracy score from 0 to 100.' },
            fluencyScore: { type: 'number', description: 'Fluency score from 0 to 100.' },
            feedback: { type: 'string', description: '1-2 sentences of feedback.' },
          },
          required: ['accuracyScore', 'fluencyScore', 'feedback'],
        },
        // Low temperature encourages predictable, structured output
        temperature: 0.1, 
      }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      console.error("Empty response for grading. Assigning low score fallback.");
      // Ensure we don't return 0 on a structural error
      return { accuracyScore: 10, fluencyScore: 10, feedback: 'AI grading system failed to respond structured data.' };
    }
    
    const result: GradingOutput = JSON.parse(jsonText);
    
    return result;

  } catch (error) {
    console.error('Gemini API Error grading answer:', error);
    // Return a non-crashing default fallback
    return { accuracyScore: 10, fluencyScore: 10, feedback: 'Error: Could not process grade via AI. Check API usage.' };
  }
}