import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (type: 'login' | 'register') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.error || 'Auth failed');
      }
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Sign In / Register</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-2 w-full p-2 rounded border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full p-2 rounded border"
        />
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
          onClick={() => handleAuth('login')}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          className="w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => handleAuth('register')}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
