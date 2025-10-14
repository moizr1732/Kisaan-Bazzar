
'use client';

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import PublicLayout from '@/components/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { AlertTriangle, MapPin, Leaf, Search, ImageIcon, Truck, Star, Sparkles, CalendarClock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { communityMockData, categories, availability } from '@/lib/community-mock-data';
import type { CommunityCrop } from '@/lib/community-mock-data';

export default function CommunityPage() {
  const [crops, setCrops] = useState<CommunityCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCrops() {
      try {
        // Using mock data
        setCrops(communityMockData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load marketplace data.');
      } finally {
        setLoading(false);
      }
    }
    fetchCrops();
  }, []);

  const mostWantedCrops = crops.filter(crop => crop.tags.includes('High Demand'));
  const availableCrops = crops.filter(crop => !crop.tags.includes('Upcoming'));
  const upcomingCrops = crops.filter(crop => crop.tags.includes('Upcoming'));

  if (error) {
    return (
      <PublicLayout>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </PublicLayout>
    );
  }

  const renderCropCard = (crop: CommunityCrop) => (
      <Card key={`${crop.farmer.uid}-${crop.slug}`} className="overflow-hidden cursor-pointer group" onClick={() => router.push(`/farmers/${crop.farmer.uid}`)}>
        <CardContent className="p-0">
          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {crop.imageUrl ? (
              <Image 
                  src={crop.imageUrl} 
                  alt={crop.name} 
                  width={200} 
                  height={200} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={crop.imageHint}
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3 flex-col items-start">
            <p className="font-semibold w-full truncate">{crop.name}</p>
            <p className="text-sm text-muted-foreground">Rs. {crop.price || '??'} / 40kg</p>
            <div className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-1">
                <Avatar className="w-4 h-4">
                    <AvatarImage src={crop.farmer.photoURL} alt={crop.farmer.name} />
                    <AvatarFallback>{crop.farmer.name?.[0]}</AvatarFallback>
                </Avatar>
                <span>{crop.farmer.name}</span>
            </div>
        </CardFooter>
      </Card>
  )

  return (
    <PublicLayout>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="col-span-1 lg:sticky top-20 h-fit">
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search crops..." className="pl-10" />
                        </div>
                        
                        {/* Price Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Price Range (per 40kg)</Label>
                                <span className="text-sm font-medium text-muted-foreground">Rs. {priceRange[0]} - {priceRange[1]}</span>
                            </div>
                            <Slider
                                defaultValue={[0, 10000]}
                                max={10000}
                                step={100}
                                value={priceRange}
                                onValueChange={(value) => setPriceRange(value)}
                            />
                        </div>

                        {/* Location Input */}
                         <div className="space-y-2">
                             <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g., Lahore" />
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox id={`cat-${category.id}`} />
                                        <label htmlFor={`cat-${category.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {category.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="space-y-2">
                            <Label>Availability</Label>
                            <div className="space-y-2">
                                {availability.map(item => (
                                     <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox id={`avail-${item.id}`} />
                                        <label htmlFor={`avail-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full">Apply Filters</Button>

                    </CardContent>
                </Card>
            </aside>

            {/* Main Content */}
            <main className="col-span-1 lg:col-span-3 space-y-10">
                {loading ? (
                     <div className="space-y-8">
                        <Skeleton className="h-8 w-48" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Most Wanted */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                <Star className="text-yellow-500" />
                                Most Wanted
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {mostWantedCrops.map(renderCropCard)}
                            </div>
                        </section>

                        {/* Available Now */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                <Sparkles className="text-green-600" />
                                Available Now
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                               {availableCrops.map(renderCropCard)}
                            </div>
                        </section>

                        {/* Coming Soon */}
                         <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                <CalendarClock className="text-blue-600"/>
                                Coming Soon
                            </h2>
                             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                               {upcomingCrops.map(renderCropCard)}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    </PublicLayout>
  );
}

    