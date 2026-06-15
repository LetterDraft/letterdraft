"use client";
import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setCoverLetter("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resume }),
    });
    const data = await res.json();
    setCoverLetter(data.coverLetter);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LetterDraft</h1>
        <p className="text-gray-500 mb-6">Generate a professional cover letter in seconds.</p>

        <textarea
          className="w-full border border-gray-200 rounded-lg p-4 text-sm mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <textarea
          className="w-full border border-gray-200 rounded-lg p-4 text-sm mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your resume or experience here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        {coverLetter && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
            {coverLetter}
          </div>
        )}
      </div>
    </main>
  );
}