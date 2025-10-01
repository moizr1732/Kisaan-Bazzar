"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mic,
  Leaf,
  LineChart,
  User,
  Settings,
  History,
  MapPin,
  Languages,
  Pencil,
  ArrowUp,
  ArrowDown,
  Volume2,
  CloudSun,
  Bell,
  Home,
  BotMessageSquare,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { DiagnosisModal } from "@/components/dashboard/DiagnosisModal";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Advisory } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import placeholderImage from "@/lib/placeholder-images.json";
import { Logo } from "@/components/Logo";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [latestAdvisory, setLatestAdvisory] = useState<Advisory | null>(null);
  const [loadingAdvisory, setLoadingAdvisory] = useState(true);
  const avatarImage = placeholderImage.placeholderImages.find(p => p.id === 'avatar-placeholder');

  useEffect(() => {
    async function fetchLatestAdvisory() {
      if (!user) {
        setLoadingAdvisory(false);
        return;
      };
      try {
        const q = query(
          collection(db, "advisories"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const advisoryDoc = querySnapshot.docs[0];
          setLatestAdvisory({ id: advisoryDoc.id, ...advisoryDoc.data() } as Advisory);
        }
      } catch (error) {
        console.error("Error fetching latest advisory:", error);
      } finally {
        setLoadingAdvisory(false);
      }
    }
    fetchLatestAdvisory();
  }, [user]);

  const onAdvisoryCreated = (newAdvisory: Advisory) => {
    setLatestAdvisory(newAdvisory);
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'A';
  }

  const marketData = [
    { crop: "Wheat", price: "2,400", change: "increase", icon: "🌾" },
    { crop: "Rice", price: "3,200", change: "decrease", icon: "🍚" },
  ];

  const alerts = [
      { type: "Weather Alert", message: "Expect rain in the next 3 days", color: "bg-yellow-100 text-yellow-800" },
      { type: "Disease Alert", message: "Tomato blight reported in the area", color: "bg-red-100 text-red-800" },
      { type: "Market Update", message: "Onion prices have increased", color: "bg-green-100 text-green-800" },
  ]

  const quickAccessItems = [
    { label: "Voice Advisory", icon: Mic, color: "bg-blue-500", action: () => setIsModalOpen(true) },
    { label: "My Crops", icon: Leaf, color: "bg-green-500", action: () => {} },
    { label: "Market Rate", icon: LineChart, color: "bg-yellow-500", action: () => router.push('/market') },
    { label: "Profile", icon: User, color: "bg-purple-500", action: () => router.push('/profile') },
    { label: "Settings", icon: Settings, color: "bg-gray-600", action: () => {} },
    { label: "History", icon: History, color: "bg-red-500", action: () => router.push('/history') },
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
            <Bell className="text-gray-600" />
            <Avatar className="h-8 w-8">
                <AvatarImage src={avatarImage?.imageUrl} />
                <AvatarFallback>{getInitials(userProfile?.name, user?.email)}</AvatarFallback>
            </Avatar>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* User Profile Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white">
                    <AvatarImage src={avatarImage?.imageUrl} data-ai-hint={avatarImage?.imageHint} />
                    <AvatarFallback className="text-3xl">{getInitials(userProfile?.name, user?.email)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold">{userProfile?.name || 'Farmer'}</h2>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{userProfile?.location || 'Location not set'}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Languages className="w-3 h-3" />
                <span>{userProfile?.language ? {en: 'English', ur: 'Urdu', pa: 'Punjabi'}[userProfile.language] : 'English'}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
                <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div>
            <h2 className="text-lg font-semibold mb-2 px-2">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
            {quickAccessItems.map(item => (
                <button
                    key={item.label}
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-white font-semibold space-y-2 ${item.color}`}
                >
                    <item.icon className="w-8 h-8" />
                    <span className="text-sm">{item.label}</span>
                </button>
            ))}
            </div>
        </div>

        {/* Today's Market Rate */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Today's Market Rate</CardTitle>
                <Button variant="link" size="sm" onClick={() => router.push('/market')}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {marketData.map(item => (
                    <div key={item.crop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">{item.icon}</div>
                            <div>
                                <p className="font-bold">{item.crop}</p>
                                <p className="text-sm text-muted-foreground">per 40kg</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-lg">Rs {item.price}</p>
                             {item.change === 'increase' ? (
                                <p className="text-xs text-green-600 flex items-center justify-end"><ArrowUp className="w-3 h-3 mr-1"/> Price increasing</p>
                             ) : (
                                <p className="text-xs text-red-600 flex items-center justify-end"><ArrowDown className="w-3 h-3 mr-1"/> Price decreasing</p>
                             )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        {/* Latest Advisory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Advisory</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAdvisory ? (
              <p>Loading latest advisory...</p>
            ) : latestAdvisory ? (
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-800">Cotton Crop</p>
                  <p className="text-sm text-blue-700">{latestAdvisory.diagnosis}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {latestAdvisory.createdAt ? formatDistanceToNow(latestAdvisory.createdAt.toDate(), { addSuffix: true }) : ''}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                    <Volume2 className="text-blue-600" />
                </Button>
              </div>
            ) : (
              <p>No advisories found. Get your first diagnosis!</p>
            )}
          </CardContent>
        </Card>

        {/* Important Alerts */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Important Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg flex items-start gap-3 ${alert.color}`}>
                        <Bell className="w-5 h-5 mt-1" />
                        <div>
                            <p className="font-bold">{alert.type}</p>
                            <p className="text-sm">{alert.message}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        {/* Weather */}
        <Card className="bg-blue-500 text-white">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="font-bold">Weather Conditions</p>
                    <p className="text-4xl font-bold">32°C</p>
                    <p>Lahore</p>
                </div>
                <div className="text-center">
                    <CloudSun className="w-16 h-16" />
                    <p>Clear Skies</p>
                </div>
            </CardContent>
        </Card>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t flex justify-around md:hidden">
          <Button variant="ghost" className="flex flex-col h-16 text-primary" onClick={() => router.push('/dashboard')}>
              <Home />
              <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16" onClick={() => setIsModalOpen(true)}>
              <BotMessageSquare />
              <span className="text-xs">Advisory</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16" onClick={() => {}}>
              <Leaf />
              <span className="text-xs">My Crops</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16" onClick={() => router.push('/market')}>
              <BarChart3 />
              <span className="text-xs">Market</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16" onClick={() => router.push('/profile')}>
              <UserCircle />
              <span className="text-xs">Profile</span>
          </Button>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden" />

      <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={onAdvisoryCreated} />
    </div>
  );
}
