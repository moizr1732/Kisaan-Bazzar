
'use client';

import { useEffect, useState, useMemo } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Search, ImageIcon, Star, Sparkles, CalendarClock, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { communityMockData, categories, availability } from '@/lib/community-mock-data';
import type { CommunityCrop } from '@/lib/community-mock-data';

const initialPriceRange = [0, 10000];

export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const [filteredCrops, setFilteredCrops] = useState<CommunityCrop[]>(communityMockData);

  const router = useRouter();

  const handleCategoryChange = (categoryId: string, checked: boolean | 'indeterminate') => {
    setSelectedCategories(prev => 
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
  };
  
  const handleAvailabilityChange = (availabilityId: string, checked: boolean | 'indeterminate') => {
    setSelectedAvailability(prev => 
      checked ? [...prev, availabilityId] : prev.filter(id => id !== availabilityId)
    );
  };

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let crops = communityMockData;

      // Search query
      if (searchQuery) {
        crops = crops.filter(crop => crop.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      
      // Price range
      crops = crops.filter(crop => {
          const price = parseInt(crop.price || '0');
          return price >= priceRange[0] && price <= priceRange[1];
      });

      // Location
      if (location) {
          crops = crops.filter(crop => 
              crop.farmer.location && crop.farmer.location.toLowerCase().includes(location.toLowerCase())
          );
      }

      // Categories
      if (selectedCategories.length > 0) {
          crops = crops.filter(crop => selectedCategories.includes(crop.category.toLowerCase()));
      }
      
      // Availability
      if (selectedAvailability.length > 0) {
          const hasDelivery = selectedAvailability.includes('delivery');
          const hasPickup = selectedAvailability.includes('pickup');
          // This is a simple mock logic. A real app would have this data per crop.
          // For now, let's assume some are available for pickup, some for delivery.
          if (hasDelivery) {
              crops = crops.filter((_, index) => index % 2 === 0); // Mock: even index crops have delivery
          }
           if (hasPickup) {
              crops = crops.filter((_, index) => index % 2 !== 0); // Mock: odd index crops have pickup
          }
      }

      setFilteredCrops(crops);
      setLoading(false);
    }, 500); // Simulate network delay
  };

  const resetFilters = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchQuery('');
      setPriceRange(initialPriceRange);
      setLocation('');
      setSelectedCategories([]);
      setSelectedAvailability([]);
      setFilteredCrops(communityMockData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const mostWantedCrops = useMemo(() => filteredCrops.filter(crop => crop.tags.includes('High Demand')), [filteredCrops]);
  const availableCrops = useMemo(() => filteredCrops.filter(crop => !crop.tags.includes('Upcoming')), [filteredCrops]);
  const upcomingCrops = useMemo(() => filteredCrops.filter(crop => crop.tags.includes('Upcoming')), [filteredCrops]);


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
  
  const renderSkeletonLoader = () => (
      <div className="space-y-10">
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
      </div>
  )

  return (
    <PublicLayout>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="col-span-1 lg:sticky top-20 h-fit">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Filters</CardTitle>
                            <Button variant="ghost" size="sm" onClick={resetFilters} disabled={loading}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search crops..." 
                                className="pl-10" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        {/* Price Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Price Range (per 40kg)</Label>
                                <span className="text-sm font-medium text-muted-foreground">Rs. {priceRange[0]} - {priceRange[1]}</span>
                            </div>
                            <Slider
                                min={0}
                                max={10000}
                                step={100}
                                value={priceRange}
                                onValueChange={(value) => setPriceRange(value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Location Input */}
                         <div className="space-y-2">
                             <Label htmlFor="location">Location</Label>
                            <Input 
                                id="location" 
                                placeholder="e.g., Lahore" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`cat-${category.id}`}
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                                            disabled={loading}
                                        />
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
                                        <Checkbox 
                                            id={`avail-${item.id}`}
                                            checked={selectedAvailability.includes(item.id)}
                                            onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                                            disabled={loading}
                                        />
                                        <label htmlFor={`avail-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full" onClick={applyFilters} disabled={loading}>
                            Apply Filters
                        </Button>

                    </CardContent>
                </Card>
            </aside>

            {/* Main Content */}
            <main className="col-span-1 lg:col-span-3 space-y-10">
                {loading ? (
                    renderSkeletonLoader()
                ) : (
                    <>
                        {mostWantedCrops.length > 0 && (
                          <section>
                              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                  <Star className="text-yellow-500" />
                                  Most Wanted
                              </h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                  {mostWantedCrops.map(renderCropCard)}
                              </div>
                          </section>
                        )}

                        {availableCrops.length > 0 && (
                          <section>
                              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                  <Sparkles className="text-green-600" />
                                  Available Now
                              </h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {availableCrops.map(renderCropCard)}
                              </div>
                          </section>
                        )}


                        {upcomingCrops.length > 0 && (
                          <section>
                              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                                  <CalendarClock className="text-blue-600"/>
                                  Coming Soon
                              </h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {upcomingCrops.map(renderCropCard)}
                              </div>
                          </section>
                        )}

                        {filteredCrops.length === 0 && (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <p className="font-semibold text-lg">No crops found</p>
                                    <p className="text-muted-foreground">Try adjusting your filters or click 'Reset' to see all crops.</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    </PublicLayout>
  );
}
