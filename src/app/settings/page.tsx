"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, HelpCircle, Headset, Star, Home, BotMessageSquare, Leaf, BarChart3, UserCircle } from "lucide-react";
import { DiagnosisModal } from "@/components/dashboard/DiagnosisModal";

export default function SettingsPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        weather: true,
        market: true,
        disease: false,
    });

    return (
        <div className="bg-background min-h-screen">
            <header className="flex items-center gap-4 p-4 bg-primary text-primary-foreground shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold">Settings</h1>
            </header>

            <main className="p-4 space-y-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Language & Region</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="app-language" className="text-sm">App Language</label>
                            <Select defaultValue="en">
                                <SelectTrigger id="app-language" className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ur">Urdu</SelectItem>
                                    <SelectItem value="pa">Punjabi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="region" className="text-sm">Region</label>
                            <Select defaultValue="pk">
                                <SelectTrigger id="region" className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pk">Pakistan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Weather Alerts</p>
                                <p className="text-xs text-muted-foreground">Get notified about weather changes</p>
                            </div>
                            <Switch
                                id="weather-alerts"
                                checked={notificationSettings.weather}
                                onCheckedChange={(checked) => setNotificationSettings(s => ({ ...s, weather: checked }))}
                            />
                        </div>
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Market Updates</p>
                                <p className="text-xs text-muted-foreground">Wholesale rate changes</p>
                            </div>
                             <Switch
                                id="market-updates"
                                checked={notificationSettings.market}
                                onCheckedChange={(checked) => setNotificationSettings(s => ({ ...s, market: checked }))}
                            />
                        </div>
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Disease Alerts</p>
                                <p className="text-xs text-muted-foreground">Crop disease outbreak warnings</p>
                            </div>
                             <Switch
                                id="disease-alerts"
                                checked={notificationSettings.disease}
                                onCheckedChange={(checked) => setNotificationSettings(s => ({ ...s, disease: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Privacy & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <Button variant="ghost" className="w-full justify-between">Data Sharing <ChevronRight /></Button>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-between">Location Access <ChevronRight /></Button>
                         <Separator />
                        <Button variant="ghost" className="w-full justify-between">Change Password <ChevronRight /></Button>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Help & Support</CardTitle>
                    </Header>
                    <CardContent className="space-y-1">
                        <Button variant="ghost" className="w-full justify-between"><span className="flex items-center gap-2"><HelpCircle /> FAQs</span> <ChevronRight /></Button>
                         <Separator />
                        <Button variant="ghost" className="w-full justify-between"><span className="flex items-center gap-2"><Headset /> Contact Support</span> <ChevronRight /></Button>
                         <Separator />
                        <Button variant="ghost" className="w-full justify-between"><span className="flex items-center gap-2"><Star /> Rate App</span> <ChevronRight /></Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">App Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Version: 1.0.0</p>
                        <p>Last Updated: October 2024</p>
                        <div className="pt-2">
                            <Button variant="link" className="p-0 h-auto text-primary">Terms of Service</Button> <br/>
                            <Button variant="link" className="p-0 h-auto text-primary">Privacy Policy</Button>
                        </div>
                    </CardContent>
                </Card>

            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t flex justify-around md:hidden">
                <Button variant="ghost" className="flex flex-col h-16" onClick={() => router.push('/dashboard')}>
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

            <div className="h-16 md:hidden" />

            <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={() => {}} />
        </div>
    );
}
