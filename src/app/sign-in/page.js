import { SignIn } from '@clerk/nextjs';

export default function ClerkSignInRoutingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-offWhite p-4">
      <div className="shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-brand-crimson hover:bg-red-700 text-sm normal-case font-title font-bold',
              card: 'bg-brand-white',
            }
          }}
        />
      </div>
    </main>
  );
}