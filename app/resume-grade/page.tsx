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

      <ResumeUpload onTextExtracted={(text) => setResumeText(text)} />

      <div className="mt-4">
        <label className="block text-sm text-gray-500 mb-1">Or paste your resume text:</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={8}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          placeholder="Paste your resume text here..."
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <button
        onClick={handleGrade}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Grading...' : 'Grade My Resume'}
      </button>
      
      {result && (
        <div className="mt-10 border-t pt-8">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-blue-600">{result.overallScore}</div>
            <div className="text-gray-500 mt-1">Overall Score</div>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(result.categories).map(([key, cat]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{CATEGORY_LABELS[key]}</span>
                  <span className="font-bold text-sm">{cat.score}</span>
                </div>
                <p className="text-sm text-gray-600">{cat.feedback}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Top Strengths</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {result.topStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-2">Top Improvements</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {result.topImprovements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
