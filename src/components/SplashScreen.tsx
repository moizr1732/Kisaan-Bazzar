
'use client';

import { Logo } from './Logo';
import { Leaf, ShoppingCart, Tractor, Wheat } from 'lucide-react';

export function SplashScreen() {
  const icons = [
    { Icon: Leaf, className: 'text-green-500' },
    { Icon: ShoppingCart, className: 'text-blue-500' },
    { Icon: Tractor, className: 'text-orange-500' },
    { Icon: Wheat, className: 'text-yellow-500' },
    { Icon: Leaf, className: 'text-green-400' },
    { Icon: ShoppingCart, className: 'text-blue-400' },
  ];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background overflow-hidden relative">
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => {
          const Icon = icons[i % icons.length].Icon;
          const className = icons[i % icons.length].className;
          const animationDelay = `${Math.random() * 5}s`;
          const animationDuration = `${5 + Math.random() * 5}s`;
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
              <Icon className={`${className} opacity-20 w-full h-full`} />
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
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh);
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
          animation: fadeInScale 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
