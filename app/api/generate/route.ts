import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { jobDescription, resume } = await req.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a professional cover letter based on this job description and resume.
        
Job Description:
${jobDescription}

Resume/Experience:
${resume}

Write a compelling, personalized cover letter that highlights relevant experience and enthusiasm for the role.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ coverLetter: text });
}