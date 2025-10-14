
'use client';

import { Logo } from './Logo';
import { Leaf, ShoppingCart, Tractor, Wheat } from 'lucide-react';
import Image from 'next/image';

export function SplashScreen() {
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

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background overflow-hidden relative">
      
      <div className="absolute inset-0">
        {Array.from({ length: 16 }).map((_, i) => {
          const Icon = icons[i % icons.length].Icon;
          const className = icons[i % icons.length].className;
          const animationDelay = `${Math.random() * 7}s`;
          const animationDuration = `${7 + Math.random() * 7}s`;
          const left = `${Math.random() * 100}%`;
          const size = `${2 + Math.random() * 4}rem`;

          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left,
                animationDelay,
                animationDuration,
                width: size,
                height: size,
              }}
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
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
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
