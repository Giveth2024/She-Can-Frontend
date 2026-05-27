'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminRootRedirectPage() {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState('');

  const credentials = {
    username: 'Admin_She_Can',
    password: 'Admin2026(4)'
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000); // Clear tooltip state after 2s
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-body">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 flex flex-col items-center text-center">
        
        {/* Brand Identity / Logo Area */}
        <div className="mb-6 flex flex-col items-center">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop/Aq2NJ23MzBH2rx2j/she-YlenJon1O7ieeEoa.jpg" 
            alt="She Can Foundation Logo" 
            className="h-16 w-auto object-contain rounded-lg mb-3 shadow-sm"
          />
          <h1 className="font-title font-bold text-2xl text-slate-900 tracking-tight">
            Administrative Access
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please use the secure foundation credentials below to authenticate.
          </p>
        </div>

        {/* Credentials Informational Alert Block */}
        <div className="w-full bg-amber-50/60 border border-amber-200 rounded-xl p-5 mb-8 text-left space-y-4">
          <div className="flex items-center space-x-2 text-amber-800 font-semibold text-sm">
            <span>🔑</span>
            <span>System Master Access Account Details</span>
          </div>

          <div className="space-y-3">
            {/* Username Field Row */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Username / Email
              </label>
              <div className="flex items-center justify-between bg-white border border-amber-200/70 rounded-lg p-2.5 shadow-sm">
                <code className="text-sm text-slate-800 font-mono font-bold select-all break-all">
                  {credentials.username}
                </code>
                <button
                  onClick={() => handleCopy(credentials.username, 'user')}
                  className="ml-2 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                >
                  {copiedField === 'user' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Password Field Row */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="flex items-center justify-between bg-white border border-amber-200/70 rounded-lg p-2.5 shadow-sm">
                <code className="text-sm text-slate-800 font-mono font-bold select-all break-all">
                  {credentials.password}
                </code>
                <button
                  onClick={() => handleCopy(credentials.password, 'pass')}
                  className="ml-2 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                >
                  {copiedField === 'pass' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Gateway to Clerk Form */}
        <button
          onClick={() => router.push('/admin/sign-in')}
          className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-title font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
        >
          <span>Proceed to Secure Sign In</span>
          <span className="text-xl font-normal leading-none">→</span>
        </button>

      </div>
    </main>
  );
}