import { Leaf } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Leaf className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline text-foreground">
        AgriMitra
      </span>
    </div>
  );
}
