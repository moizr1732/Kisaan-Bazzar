"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import placeholderImage from "@/lib/placeholder-images.json";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const farmImage = placeholderImage.placeholderImages.find(p => p.id === 'farm-background');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
           {farmImage && (
            <Image
                src={farmImage.imageUrl}
                alt={farmImage.description}
                data-ai-hint={farmImage.imageHint}
                fill
                className="object-cover -z-10 opacity-30"
            />
           )}
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                        Your AI-Powered Farming Companion
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        AgriMitra offers instant, voice-based crop diagnosis and expert advisories to help you protect your harvest.
                    </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg" className="font-bold">
                        <Link href="/signup">
                        Sign Up for Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    </div>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
