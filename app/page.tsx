"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      localStorage.setItem("usageCount", "0");
      localStorage.setItem("paid", "true");
      window.history.replaceState({}, "", "/");
    }
    const paid = localStorage.getItem("paid") === "true";
    if (paid) {
      setUsageCount(0);
      return;
    }
    const count = parseInt(localStorage.getItem("usageCount") || "0");
    setUsageCount(count);
  }, []);

  const generate = async () => {
    if (usageCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setCoverLetter("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resume }),
    });
    const data = await res.json();
    setCoverLetter(data.coverLetter);

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("usageCount", newCount.toString());
    setLoading(false);
  };

  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin: window.location.origin }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LetterDraft</h1>
        <p className="text-gray-500 mb-6">Generate a professional cover letter in seconds.</p>

        {showPaywall ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You've used your free letter!</h2>
            <p className="text-gray-500 mb-6">Upgrade to LetterDraft Pro for unlimited cover letters.</p>
            <button
              onClick={handleUpgrade}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Upgrade for $9/month
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}