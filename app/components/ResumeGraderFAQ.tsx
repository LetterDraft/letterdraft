export default function ResumeGraderFAQ() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Is there a free resume grader?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Yes. LetterDraft&apos;s Resume Grader is free to use. Upload a
            resume as a PDF or Word document and get an instant AI-generated
            grade with feedback. A paid AI resume rewrite is available for
            $9/month if you want the grader&apos;s suggestions applied
            automatically.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            How does AI resume grading work?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            LetterDraft parses the text from your uploaded resume and scores
            it across five categories: clarity, impact, formatting,
            keyword relevance, and overall structure. Each category gets a
            score and specific, actionable feedback rather than a generic
            pass/fail result.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            What does the resume grader check for?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The grader evaluates whether your bullet points show measurable
            impact, whether your formatting is clean and ATS-friendly,
            whether your language is clear and concise, whether you&apos;re
            using relevant keywords for your target role, and whether the
            overall structure follows resume best practices.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            How is this different from an ATS resume checker?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Most ATS checkers only look for keyword matches against a job
            description. LetterDraft&apos;s grader evaluates the actual
            quality of your writing and structure, then offers an optional
            AI rewrite that improves the resume rather than just flagging
            problems.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Is my resume data private?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Your resume is processed to generate your grade and is not sold
            or shared with third parties. You can delete your data at any
            time.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            How long does resume grading take?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Grading is instant. Upload your resume and get your score and
            feedback in seconds, no account required.
          </p>
        </div>
      </div>
    </section>
  );
}
