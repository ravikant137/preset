
import React, { useState } from 'react';
import { useImageUpload } from './hooks/useImageUpload';
import { analyzeImage } from './api/analyze';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { file, preview, onDrop, clear } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token') || '';
      const res = await analyzeImage(formData, token);
      if (res.success) {
        localStorage.setItem('result', JSON.stringify(res.data));
        router.push('/result');
      } else {
        setError(res.error || 'Analysis failed');
      }
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Preset Generator</h1>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={e => onDrop(Array.from(e.target.files || []))}
          className="mb-4"
        />
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-64 object-contain mb-4 rounded" />
        )}
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {file && (
          <button className="mt-2 text-sm text-gray-500 underline" onClick={clear}>Clear</button>
        )}
      </div>
    </div>
  );
}
