
'use client';

import { useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Leaf } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white px-6">
        <Logo />
        <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/')}>
                <Leaf className="mr-2 h-4 w-4" /> Are you a Farmer?
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
