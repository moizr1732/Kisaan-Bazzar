
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, BotMessageSquare, BarChart3, UserCircle } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/voice-agent", icon: BotMessageSquare, label: "Agent" },
    { href: "/market", icon: BarChart3, label: "Market" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t flex justify-around md:hidden z-10">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={`flex flex-col h-16 ${pathname === item.href ? "text-primary" : ""}`}
          onClick={() => router.push(item.href)}
        >
          <item.icon />
          <span className="text-xs">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}

    