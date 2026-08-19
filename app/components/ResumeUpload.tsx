'use client';
import { useState, useRef } from 'react';
interface ResumeUploadProps {
  onTextExtracted: (text: string) => void;
}
export default function ResumeUpload({ onTextExtracted }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file: File) => {
    setError(null);
    setIsParsing(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to parse file');
        setFileName(null);
        return;
      }
      onTextExtracted(data.text);
    } catch {
      setError('Something went wrong. Try pasting the text manually instead.');
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onFileChange}
        />
        {isParsing ? (
          <p className="text-gray-500">Parsing {fileName}...</p>
        ) : fileName ? (
          <p className="text-gray-700">{fileName} uploaded. Click or drop to replace.</p>
        ) : (
          <>
            <p className="text-gray-600 font-medium">Drag & drop your resume here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse (.pdf, .docx)</p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
         
