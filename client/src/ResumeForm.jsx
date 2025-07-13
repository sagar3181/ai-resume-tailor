import React, { useState, useEffect } from 'react';

export default function ResumeForm() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Optional: Persist theme across reloads
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5050/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setResumeText(data.text.trim());
      } else {
        alert('Failed to parse PDF. Try another file.');
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
      const response = await fetch('http://localhost:5050/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobText }),
      });

      const data = await response.json();
      setResult(data.result || 'No result returned');
    } catch (error) {
      console.error('Error:', error);
      setResult('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex items-center justify-center px-4 py-12`}>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6 transition-colors duration-300">

        {/* Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400">🎯 AI Resume Tailor</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PDF Upload */}
          <div>
            <label className="block font-medium mb-1">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              className="file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200
                         hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
            />
          </div>

          {/* Resume Text */}
          <div>
            <label className="block font-medium mb-1">Your Resume (Text)</label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg p-4 h-40 text-sm leading-relaxed"
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg p-4 h-40 text-sm leading-relaxed"
              placeholder="Paste the job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16z" />
                </svg>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Tailor Resume'
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">📋 Result:</h2>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
