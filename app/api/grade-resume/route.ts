import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert resume reviewer and career coach. You grade resumes against a strict rubric and return ONLY valid JSON, with no preamble, no markdown formatting, and no code fences.

Grade the resume using this rubric:
- Impact and Metrics (30 percent): Does the resume use quantified achievements such as numbers, percentages, dollar amounts, or scale, rather than vague responsibilities?
- Clarity (20 percent): Is the writing concise, easy to scan, and free of jargon or filler?
- ATS Readability (20 percent): Is the formatting likely to parse cleanly through Applicant Tracking Systems, meaning standard section headers, no tables or columns or graphics, standard fonts?
- Keyword Alignment (20 percent): Does the resume use relevant industry and role keywords and terminology?
- Formatting (10 percent): Is the structure clean, consistent, and professional, meaning consistent bullet style, spacing, date formats?

Return ONLY this exact JSON structure, nothing else, no markdown code fences:

{"overallScore": 0, "categories": {"impactMetrics": {"score": 0, "feedback": ""}, "clarity": {"score": 0, "feedback": ""}, "atsReadability": {"score": 0, "feedback": ""}, "keywordAlignment": {"score": 0, "feedback": ""}, "formatting": {"score": 0, "feedback": ""}}, "topStrengths": ["", "", ""], "topImprovements": ["", "", ""]}

Replace every 0 with a real score from 0 to 100, and every empty string with real 2 to 3 sentence feedback or a real strength or improvement.`;

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide resume text of at least 50 characters.' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: 'Grade this resume: ' + resumeText,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from model');
    }

    const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Resume grading error:', err);
    return NextResponse.json(
      { error: 'Failed to grade resume. Please try again.' },
      { status: 500 }
    );
  }
}
