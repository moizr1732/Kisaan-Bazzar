
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { FloatingAgent } from '@/components/FloatingAgent';
import { ClientToaster } from '@/components/ClientToaster';
import { SplashScreen } from '@/components/SplashScreen';

// Note: Metadata export is commented out because it only works in Server Components.
// This component needs to be a Client Component to manage splash screen state.
// export const metadata: Metadata = {
//   title: 'Kisaan Bazaar',
//   description: 'AI-powered assistant for farmers',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('splashSeen')) {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splashSeen', 'true');
    }, 7000); // Increased duration to 7 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {showSplash ? (
          <SplashScreen />
        ) : (
          <AuthProvider>
            {children}
            <FloatingAgent />
            <ClientToaster />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
