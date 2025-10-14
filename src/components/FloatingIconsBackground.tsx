
'use client';

import { Leaf, ShoppingCart, Tractor, Wheat } from 'lucide-react';

export function FloatingIconsBackground() {
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
    <div className="fixed inset-0 -z-10">
      {Array.from({ length: 16 }).map((_, i) => {
        const Icon = icons[i % icons.length].Icon;
        const className = icons[i % icons.length].className;
        const animationDelay = `${Math.random() * 15}s`;
        const animationDuration = `${10 + Math.random() * 10}s`;
        const left = `${Math.random() * 100}%`;
        const size = `${1 + Math.random() * 3}rem`;

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
            <Icon className={`${className} opacity-10 w-full h-full`} />
          </div>
        );
      })}
    </div>
  );
}
