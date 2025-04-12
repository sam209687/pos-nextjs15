// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(data.role === 'admin' ? '/admin' : '/cashier');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
     
      <div className="flex items-center justify-center pt-20">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-lg rounded-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='mb-4'>
              <Input
                type="email"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
            <div className='mb-4'>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-transparent border border-gray-200 text-gray-800 hover:bg-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-yellow-700">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}