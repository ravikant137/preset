import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessResult } from '../../../shared/types';

export default function ResultPage() {
  const [result, setResult] = useState<ProcessResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('result');
    if (data) setResult(JSON.parse(data));
    else router.push('/');
  }, [router]);

  if (!result) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Result</h1>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
          <div className="flex-1 flex flex-col items-center">
            <span className="mb-2 text-sm text-gray-500">Original</span>
            <img src={result.original_image_url} alt="Original" className="w-full h-64 object-contain rounded" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="mb-2 text-sm text-gray-500">Processed</span>
            <img src={result.processed_image_url} alt="Processed" className="w-full h-64 object-contain rounded" />
          </div>
        </div>
        <div className="w-full mb-4">
          <h2 className="font-semibold mb-2">Caption</h2>
          <div className="flex items-center gap-2">
            <span className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded">{result.caption}</span>
            <button onClick={() => navigator.clipboard.writeText(result.caption)} className="px-2 py-1 bg-blue-500 text-white rounded">Copy</button>
          </div>
        </div>
        <div className="w-full mb-4">
          <h2 className="font-semibold mb-2">Hashtags</h2>
          <div className="flex items-center gap-2">
            <span className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded break-words">{result.hashtags.join(' ')}</span>
            <button onClick={() => navigator.clipboard.writeText(result.hashtags.join(' '))} className="px-2 py-1 bg-blue-500 text-white rounded">Copy</button>
          </div>
        </div>
        <a href={result.processed_image_url} download className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-center">Download Image</a>
        <button onClick={() => router.push('/')} className="mt-4 text-sm text-gray-500 underline">Try Another</button>
      </div>
    </div>
  );
}
