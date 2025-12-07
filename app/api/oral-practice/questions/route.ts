// app/api/oral-practice/questions/route.ts
import { generateVivaQuestions } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }

    // Calls the utility with the diverse prompt logic
    const questions = await generateVivaQuestions(topic);
    
    return NextResponse.json(
      { questions }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error generating questions:', error);
    // Returning a mock/fallback question on failure (handled in lib/gemini.ts)
    return NextResponse.json(
      { error: 'Internal Server Error: Failed to generate questions.' }, 
      { status: 500 }
    );
  }
}