
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Search, Clock, MapPin, ArrowUp, ArrowDown, HelpCircle, Minus, TrendingUp, AlertTriangle, Truck, Home, BotMessageSquare, Leaf, BarChart3, UserCircle, LineChart, User, LogOut, Menu, X, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { DiagnosisModal } from "@/components/dashboard/DiagnosisModal";

const overviewData = [
  { title: "High Demand", value: "12", unit: "Crops", color: "text-green-600 bg-green-50 border-green-200", icon: HelpCircle },
  { title: "Medium Demand", value: "8", unit: "Crops", color: "text-orange-600 bg-orange-50 border-orange-200", icon: Minus },
  { title: "Low Demand", value: "5", unit: "Crops", color: "text-red-600 bg-red-50 border-red-200", icon: HelpCircle },
  { title: "Active Markets", value: "15", unit: "Mandis", color: "text-blue-600 bg-blue-50 border-blue-200", icon: MapPin },
];

const cropData = [
  { name: "Wheat", urduName: "گندم", demand: "High", price40kg: "3,200", price1kg: "80", change: "+5.2%", mandi: "Lahore Mandi", updated: "1 hour ago", icon: "🌾", changeColor: "text-green-600" },
  { name: "Rice (Basmati)", urduName: "چاول", demand: "High", price40kg: "8,500", price1kg: "212", change: "+3.8%", mandi: "Sheikhupura Mandi", updated: "2 hours ago", icon: "🍚", changeColor: "text-green-600" },
  { name: "Tomato", urduName: "ٹماٹر", demand: "Medium", price40kg: "1,800", price1kg: "45", change: "-2.1%", mandi: "Karachi Mandi", updated: "3 hours ago", icon: "🍅", changeColor: "text-red-600" },
  { name: "Onion", urduName: "پیاز", demand: "Low", price40kg: "1,200", price1kg: "30", change: "-8.5%", mandi: "Multan Mandi", updated: "1 hour ago", icon: "🧅", changeColor: "text-red-600" },
  { name: "Cotton", urduName: "کپاس", demand: "High", price40kg: "6,800", price1kg: "170", change: "+7.2%", mandi: "Faisalabad Mandi", updated: "2 hours ago", icon: "☁️", changeColor: "text-green-600" },
  { name: "Potato", urduName: "آلو", demand: "Medium", price40kg: "1,600", price1kg: "40", change: "+1.5%", mandi: "Okara Mandi", updated: "4 hours ago", icon: "🥔", changeColor: "text-green-600" },
];

const alertsData = [
    { title: "High Demand Alert", message: "Cotton prices increased by 7% in Faisalabad mandi due to export demand.", time: "2 hours ago", icon: TrendingUp, color: "text-green-800 bg-green-100" },
    { title: "Weather Impact", message: "Expected rain in Punjab may affect vegetable supply. Tomato prices might rise.", time: "5 hours ago", icon: AlertTriangle, color: "text-orange-800 bg-orange-100" },
    { title: "Transport Update", message: "New transport routes opened between Karachi and Interior Sindh mandis.", time: "1 day ago", icon: Truck, color: "text-blue-800 bg-blue-100" },
]

const navItems = [
    { href: '/dashboard', label: 'Dashboard', Icon: Home },
    { href: '/voice-agent', label: 'Voice Agent', Icon: BotMessageSquare },
    { href: '/history', label: 'Advisory History', Icon: History },
    { href: '/market', label: 'Market Rates', Icon: LineChart },
    { href: '/profile', label: 'My Profile', Icon: User },
];


function MarketContent() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { logout } = useAuth();
  
  return (
    <div className="bg-background min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-white sm:flex">
         <div className="flex h-16 items-center border-b px-6">
           <Logo/>
         </div>
         <nav className="flex flex-col p-4 space-y-1">
           {navItems.map((item) => {
             const Icon = item.Icon;
             return (
              <Button
                key={item.href}
                variant={item.href === '/market' ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => router.push(item.href)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            )})}
         </nav>
         <div className="mt-auto p-4 border-t">
           <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
             <LogOut className="h-5 w-5" />
             Logout
           </Button>
         </div>
      </aside>
      
      <div className="flex flex-col w-full sm:pl-60">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm sm:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="text-gray-600" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <aside className="flex h-full w-full flex-col border-r bg-white">
                        <div className="flex h-16 items-center justify-between border-b px-6">
                           <Logo />
                           <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)}><X/></Button>
                        </div>
                        <nav className="flex flex-col p-4 space-y-1">
                           {navItems.map((item) => {
                             const Icon = item.Icon;
                             return (
                             <Button
                               key={item.href}
                               variant={item.href === '/market' ? "secondary" : "ghost"}
                               className="justify-start gap-2"
                               onClick={() => {
                                 router.push(item.href);
                                 setIsSheetOpen(false);
                               }}
                             >
                               <Icon className="h-5 w-5" />
                               {item.label}
                             </Button>
                           )})}
                        </nav>
                        <div className="mt-auto p-4 border-t">
                           <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
                             <LogOut className="h-5 w-5" />
                             Logout
                           </Button>
                        </div>
                    </aside>
                </SheetContent>
            </Sheet>
            <Logo size="sm" />
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Search className="text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Bell className="text-gray-600" />
                </Button>
            </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden sm:flex items-center justify-between p-4 bg-white border-b">
           <div className="flex items-center gap-4">
               <h1 className="text-2xl font-bold font-headline">Market Rates</h1>
           </div>
           <div className="flex items-center gap-4 w-1/2 max-w-md">
               <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search crops..." className="pl-10" />
               </div>
               <Button>
                  <Bell className="mr-2 h-4 w-4" />
                  Alerts
               </Button>
           </div>
        </header>

        <main className="p-4 space-y-6">
          {/* Market Overview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Market Overview</CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Last updated: 2 hours ago</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {overviewData.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className={`p-3 rounded-lg border flex items-center justify-between ${item.color}`}>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-xs">{item.unit}</p>
                    </div>
                    <Icon className="w-6 h-6 opacity-70" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Filter Market Rates */}
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                   <CardTitle className="text-lg">Filter Market Rates</CardTitle>
                   <Button variant="link" size="sm" className="text-sm">Clear All</Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                      <label className="text-xs font-medium text-muted-foreground">Crop Category</label>
                      <Select defaultValue="all">
                          <SelectTrigger><SelectValue/></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="vegetable">Vegetable</SelectItem>
                              <SelectItem value="fruit">Fruit</SelectItem>
                              <SelectItem value="grain">Grain</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                   <div>
                      <label className="text-xs font-medium text-muted-foreground">Region</label>
                      <Select defaultValue="all">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">All Regions</SelectItem>
                               <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="sindh">Sindh</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                   <div>
                      <label className="text-xs font-medium text-muted-foreground">Demand Level</label>
                      <Select defaultValue="all">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">All Levels</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                   <div>
                      <label className="text-xs font-medium text-muted-foreground">Sort By</label>
                      <Select defaultValue="price_desc">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                              <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                              <SelectItem value="demand">Demand</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </CardContent>
          </Card>
          
          {/* Current Market Rates */}
          <div>
              <h2 className="text-lg font-semibold mb-2 px-2">Current Market Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cropData.map(crop => (
                      <Card key={crop.name} className="overflow-hidden">
                          <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                      <div className="text-4xl">{crop.icon}</div>
                                      <div>
                                          <p className="font-bold">{crop.name}</p>
                                          <p className="text-sm text-muted-foreground">{crop.urduName}</p>
                                      </div>
                                  </div>
                                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      crop.demand === 'High' ? 'bg-green-100 text-green-800' :
                                      crop.demand === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>{crop.demand}</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                  <div>
                                      <p className="text-xs text-muted-foreground">Per 40kg</p>
                                      <p className="font-bold">Rs. {crop.price40kg}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-muted-foreground">Per kg</p>
                                      <p className="font-bold">Rs. {crop.price1kg}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-muted-foreground">Change</p>
                                      <p className={`font-bold flex items-center justify-center ${crop.changeColor}`}>
                                          {crop.change.startsWith('+') ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                                          {crop.change.substring(1)}
                                      </p>
                                  </div>
                              </div>
                          </CardContent>
                          <div className="bg-gray-50 px-4 py-2 text-xs text-muted-foreground border-t">
                              {crop.mandi} &bull; Updated {crop.updated}
                          </div>
                      </Card>
                  ))}
              </div>
              <div className="mt-6 text-center">
                  <Button>Load More Crops</Button>
              </div>
          </div>

           {/* Market Alerts & News */}
          <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Market Alerts & News</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  {alertsData.map((alert, index) => {
                      const Icon = alert.icon;
                      return (
                      <div key={index} className={`p-4 rounded-lg flex items-start gap-4 ${alert.color}`}>
                          <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                              <p className="font-bold">{alert.title}</p>
                              <p className="text-sm">{alert.message}</p>
                              <p className="text-xs opacity-80 mt-1">{alert.time}</p>
                          </div>
                      </div>
                  )})}
              </CardContent>
          </Card>

        </main>

         {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t flex justify-around md:hidden">
            <Button variant="ghost" className="flex flex-col h-16" onClick={() => router.push('/dashboard')}>
                <Home />
                <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-16" onClick={() => router.push('/voice-agent')}>
                <BotMessageSquare />
                <span className="text-xs">Agent</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-16 text-primary" onClick={() => router.push('/market')}>
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
        <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={() => {}} />
      </div>
    </div>
  );
}

export default function MarketPage() {
    return <MarketContent />
}
