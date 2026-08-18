'use client';

import { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';

interface GradeResult {
  overallScore: number;
  categories: {
    impactMetrics: { score: number; feedback: string };
    clarity: { score: number; feedback: string };
    atsReadability: { score: number; feedback: string };
    keywordAlignment: { score: number; feedback: string };
    formatting: { score: number; feedback: string };
  };
  topStrengths: string[];
  topImprovements: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  impactMetrics: 'Impact & Metrics (30%)',
  clarity: 'Clarity (20%)',
  atsReadability: 'ATS Readability (20%)',
  keywordAlignment: 'Keyword Alignment (20%)',
  formatting: 'Formatting (10%)',
};

export default function ResumeGradePage() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  const handleGrade = async () => {
    if (resumeText.trim().length < 50) {
      setError('Please upload or paste your resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/grade-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong grading your resume.');
        return;
      }

      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Resume Grader</h1>
      <p className="text-gray-600 mb-8">
        Upload your resume and get an instant, detailed grade across the 5 things recruiters and ATS systems actually check.
      </p>

      <ResumeUpload onTextExtracted={(text) =>
