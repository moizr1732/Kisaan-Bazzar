
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import placeholderImage from '@/lib/placeholder-images.json';
import { Badge } from './ui/badge';
import { Home, History, LineChart, User, LogOut, Bell, BotMessageSquare, Leaf, Languages, Loader2 } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { translateUI } from '@/ai/flows/translate-ui';
import type { UserProfile } from '@/lib/types';


const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, userProfile, fetchUserProfile, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const avatarImage = placeholderImage.placeholderImages.find(p => p.id === 'avatar-placeholder');
  const [isTranslating, setIsTranslating] = useState(false);

  const [translatedNav, setTranslatedNav] = useState([
    'Dashboard', 'Voice Agent', 'Advisory History', 'Market Rates', 'My Crops', 'My Profile'
  ]);
  
  const navItems = [
    { href: '/dashboard', label: translatedNav[0], icon: Home },
    { href: '/voice-agent', label: translatedNav[1], icon: BotMessageSquare },
    { href: '/history', label: translatedNav[2], icon: History },
    { href: '/market', label: translatedNav[3], icon: LineChart },
    { href: '/my-crops', label: translatedNav[4], icon: Leaf },
    { href: '/profile', label: translatedNav[5], icon: User },
  ];

  const translateNav = useCallback(async (language: UserProfile['language']) => {
    if (language === 'en') {
      setTranslatedNav(['Dashboard', 'Voice Agent', 'Advisory History', 'Market Rates', 'My Crops', 'My Profile']);
      return;
    }
    setIsTranslating(true);
    try {
      const originalLabels = ['Dashboard', 'Voice Agent', 'Advisory History', 'Market Rates', 'My Crops', 'My Profile'];
      const result = await translateUI({ texts: originalLabels, targetLanguage: language! });
      setTranslatedNav(result.translations);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({ variant: 'destructive', title: 'Translation failed' });
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    if (userProfile?.language) {
      translateNav(userProfile.language);
    }
  }, [userProfile?.language, translateNav]);


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


  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'A';
  }

  const handleLanguageChange = async (lang: UserProfile['language']) => {
    if (!user || !lang) return;
    try {
      await setDoc(doc(db, "users", user.uid), { language: lang }, { merge: true });
      await fetchUserProfile(user);
      toast({ title: 'Language updated!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Could not update language' });
    }
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-white sm:flex">
         <div className="flex h-16 items-center border-b px-6">
           <Logo />
         </div>
         <nav className="flex flex-col p-4 space-y-1">
           {isTranslating ? (
             <div className="flex justify-center items-center h-48">
               <Loader2 className="w-6 h-6 animate-spin" />
             </div>
           ) : (
            navItems.map(item => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))
           )}
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
              <div className="w-48">
                 <Select onValueChange={handleLanguageChange} value={userProfile?.language || 'en'} disabled={isTranslating}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        <SelectValue placeholder="Select language" />
                      </div>
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                    <SelectItem value="pa">Punjabi</SelectItem>
                    <SelectItem value="si">Sindhi</SelectItem>
                    <SelectItem value="ps">Pashto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
