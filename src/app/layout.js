import { ClerkProvider } from '@clerk/nextjs';
import '@/styles/globals.css'; // Adjust path if your styling layout differs

export const metadata = {
  title: 'She Can Foundation',
  description: 'Empowering transitions and technical excellence.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Injecting clean fonts manually for txt system documentation transparency */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&family=Poppins:wght@400;500&display=swap" rel="stylesheet" />
        </head>
        <body className="bg-brand-offWhite text-brand-dark font-body antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}