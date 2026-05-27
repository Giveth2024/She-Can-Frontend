'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function AdminAuthCallbackPage() {
  const router = useRouter();
  // isLoaded tells us when Clerk has finished initializing, userId tells us if someone is signed in
  const { getToken, isLoaded, userId } = useAuth();
  const runLogSync = useRef(false); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 1. Wait until Clerk has fully loaded its internal authentication state
    if (!isLoaded) return;

    // 2. If Clerk loaded but there's no active session, bounce them back to login immediately
    if (!userId) {
      router.push('/admin');
      return;
    }

    // 3. Once auth is ready and user is confirmed, ensure we only hit the backend API once
    if (runLogSync.current) return;
    runLogSync.current = true;

    const executeLogSync = async () => {
      try {
        const token = await getToken();
        
        // Safety check if token retrieval encountered an issue
        if (!token) {
          throw new Error('Authentication token could not be generated. Please try again.');
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/log-signin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          router.push('/admin/dashboard');
        } else {
          throw new Error(data.message || 'System failed to register a secure backend audit log entry.');
        }

      } catch (err) {
        console.error("Critical error syncing login authorization logs to Express context:", err);
        setErrorMessage(err.message || 'An unexpected authentication sync error occurred.');
        
        setTimeout(() => {
          router.push('/admin');
        }, 3000);
      }
    };

    executeLogSync();
  }, [isLoaded, userId, getToken, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="flex flex-col items-center space-y-4 max-w-md w-full text-center">
        
        {errorMessage ? (
          /* Error State UI Alert Box */
          <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm w-full animate-pulse">
            <div className="text-2xl mb-2 font-bold">⚠️</div>
            <h3 className="font-title font-bold text-lg text-slate-900 mb-1">Sync Authentication Failure</h3>
            <p className="font-body text-sm text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-xs text-red-500 font-medium">
              Redirecting safely back to entry gate in a moment...
            </p>
          </div>
        ) : (
          /* Processing Loading State UI */
          <>
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-body text-slate-500 font-medium animate-pulse">
              Synchronizing security profile... Please wait.
            </p>
          </>
        )}

      </div>
    </main>
  );
}