import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic();
export async function POST(req: NextRequest) {
  const { resumeText } = await req.json();
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Rewrite the following resume to maximize its impact, clarity, and ATS (applicant tracking system) readability. 

Rules:
- Keep all factual content (companies, dates, titles) exactly as given — do not invent experience.
- Strengthen bullet points with strong action verbs and quantifiable impact where the original implies it.
- Improve clarity and remove filler language.
- Ensure formatting is clean and ATS-friendly (no tables, no special characters, standard section headers).
- Keep the same overall structure and section order as the original.

Resume:
${resumeText}

Return only the rewritten resume text, with no preamble or explanation.`,
      },
    ],
  });
  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ rewrittenResume: text });
}
