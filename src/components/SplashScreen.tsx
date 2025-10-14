
'use client';

import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Leaf, ShoppingCart, Tractor, Wheat } from 'lucide-react';
import Image from 'next/image';

const icons = [
  { Icon: Leaf, className: 'text-green-300' },
  { Icon: ShoppingCart, className: 'text-blue-300' },
  { Icon: Tractor, className: 'text-orange-300' },
  { Icon: Wheat, className: 'text-yellow-300' },
  { Icon: Leaf, className: 'text-green-200' },
  { Icon: ShoppingCart, className: 'text-blue-200' },
  { Icon: Tractor, className: 'text-orange-200' },
  { Icon: Wheat, className: 'text-yellow-200' },
];

interface IconStyle {
  left: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
}

export function SplashScreen() {
  const [iconStyles, setIconStyles] = useState<IconStyle[]>([]);

  useEffect(() => {
    // Generate styles only on the client-side to avoid hydration mismatch
    const styles = Array.from({ length: 16 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 7}s`,
      animationDuration: `${7 + Math.random() * 7}s`,
      width: `${2 + Math.random() * 4}rem`,
      height: `${2 + Math.random() * 4}rem`,
    }));
    setIconStyles(styles);
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background overflow-hidden relative">
      <div className="absolute inset-0">
        {iconStyles.map((style, i) => {
          const { Icon, className } = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={style}
            >
              <Icon className={`${className} opacity-30 w-full h-full`} />
            </div>
          );
        })}
      </div>
      <div className="z-10 animate-fade-in-scale">
        <Logo size="default" />
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
