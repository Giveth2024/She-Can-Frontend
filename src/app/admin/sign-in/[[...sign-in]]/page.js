"use client";

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Clerk properties need to sit inside a Suspense boundary when reading search parameters in Next.js
function SignInForm() {
  const searchParams = useSearchParams();
  
  // Captures the target parameter if passed by the middleware, otherwise strictly defaults to your log sync page
  const targetRedirectUrl = searchParams.get('redirectUrl') || '/admin/auth-callback';

  return (
    <SignIn 
      path="/admin/sign-in"
      routing="path"
      forceRedirectUrl={targetRedirectUrl} 
      appearance={{
        elements: {
          formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-sm normal-case font-title font-bold text-white transition-colors',
          card: 'bg-white shadow-none border-0',
          headerTitle: 'font-title font-bold text-slate-900',
          headerSubtitle: 'font-body text-gray-500',
          formFieldLabel: 'font-title font-semibold text-slate-900',
          formFieldInput: 'font-body text-slate-900 border-gray-200 focus:border-red-600 focus:ring-red-600',
          footerActionLink: 'text-red-600 hover:text-red-700 font-medium'
        }
      }}
    />
  );
}

export default function ClerkAdminSpecificSignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="shadow-lg rounded-xl border border-gray-100 overflow-hidden bg-white">
        <Suspense fallback={
          <div className="p-8 text-center text-gray-400 font-body text-sm">
            Loading authentication module...
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}