import React, { useState } from 'react';

export default function ResumeForm() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

const handlePDFUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5050/api/upload-resume', {
      method: 'POST',
      body: formData, // ✅ Let browser set headers
    });

    const data = await response.json();

    if (response.ok && data.text) {
      setResumeText(data.text.trim());
    } else {
      console.error('❌ PDF Parse Error:', data.error);
      alert('Failed to parse PDF. Please try a different file.');
    }
  } catch (err) {
    console.error('❌ Upload Error:', err);
    alert('Something went wrong while uploading the file.');
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/upload-resume', {
        method: 'POST',
        body: formData, // Do NOT set headers manually here
    });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setResult('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">🎯 AI Resume Tailor</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Your Resume (Text)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-40"
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-40"
              placeholder="Paste the job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Tailor Resume'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">📋 Result:</h2>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
