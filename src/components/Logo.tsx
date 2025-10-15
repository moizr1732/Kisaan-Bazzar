import { Leaf } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'default';
  href?: string;
}

export function Logo({ size = 'default', href = '/dashboard' }: LogoProps) {
  const isSmall = size === 'sm';
  return (
    <Link href={href} className="flex items-center justify-center gap-2">
      <Leaf className={`${isSmall ? 'h-6 w-6' : 'h-8 w-8'} text-green-500`} />
      <span className={`${isSmall ? 'text-xl' : 'text-2xl'} font-bold font-headline text-foreground`}>
        Kisan Bazaar
      </span>
    </Link>
  );
}
