// app/api/oral-practice/grade/route.ts
import { gradeStudentAnswer } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question, studentAnswer } = await request.json();

    if (!question || !studentAnswer) {
      return NextResponse.json(
        { error: 'Question and answer are required' }, 
        { status: 400 }
      );
    }

    // Call the AI utility to grade the answer
    // This expects the utility to handle the specific scoring logic
    const gradeResult = await gradeStudentAnswer(question, studentAnswer);

    return NextResponse.json(
      gradeResult, 
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error grading answer:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: Failed to grade answer.' }, 
      { status: 500 }
    );
  }
}