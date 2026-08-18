import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

const pdfParse = require('pdf-parse');

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'Legacy .doc files aren\'t supported. Please save as .docx or .pdf.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX.' },
        { status: 400 }
      );
    }

    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (extractedText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text. The file may be scanned/image-based, corrupted, or empty.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (err) {
    console.error('Resume parse error:', err);
    return NextResponse.json(
      { error: 'Failed to parse file. Try pasting the text manually instead.' },
      { status: 500 }
    );
  }
}
