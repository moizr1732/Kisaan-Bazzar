
"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import placeholderImage from '@/lib/placeholder-images.json';
import { Badge } from './ui/badge';
import { Home, History, LineChart, User, LogOut, Bell, BotMessageSquare, Leaf } from 'lucide-react';
import { BottomNav } from './BottomNav';


const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const avatarImage = placeholderImage.placeholderImages.find(p => p.id === 'avatar-placeholder');

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || "Could not log you out. Please try again."
      })
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/voice-agent', label: 'Voice Agent', icon: BotMessageSquare },
    { href: '/history', label: 'Advisory History', icon: History },
    { href: '/market', label: 'Market Rates', icon: LineChart },
    { href: '/my-crops', label: 'My Crops', icon: Leaf },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'A';
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-white sm:flex">
         <div className="flex h-16 items-center border-b px-6">
           <Logo />
         </div>
         <nav className="flex flex-col p-4 space-y-1">
           {navItems.map(item => (
             <Button
               key={item.href}
               variant={pathname === item.href ? "secondary" : "ghost"}
               className="justify-start gap-2"
               onClick={() => router.push(item.href)}
             >
               <item.icon className="h-5 w-5" />
               {item.label}
             </Button>
           ))}
         </nav>
         <div className="mt-auto p-4 border-t">
           <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
             <LogOut className="h-5 w-5" />
             Logout
           </Button>
         </div>
       </aside>
       <div className="flex flex-col sm:pl-60">
        
        <header className="sticky top-0 z-30 hidden h-14 items-center gap-4 border-b bg-white px-6 sm:flex">
            <div className="flex-1">
            {/* Can add search bar here if needed */}
            </div>
            <div className="relative">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Badge className="absolute top-1 right-1 h-4 w-4 justify-center p-0" variant="destructive">3</Badge>
            </div>
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarImage?.imageUrl} />
                    <AvatarFallback>{getInitials(userProfile?.name, user?.email)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userProfile?.name || user?.email}</span>
            </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">{children}</main>
        
        <BottomNav />
       </div>
     </div>
  );
};

export default AppLayout;
