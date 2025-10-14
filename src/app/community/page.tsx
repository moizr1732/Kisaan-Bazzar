
'use client';

import { useEffect, useState } from 'react';
import type { UserProfile, Crop } from '@/lib/types';
import PublicLayout from '@/components/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Leaf, Search, ImageIcon, Truck } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { mockFarmers } from '@/lib/mock-data';

export default function CommunityPage() {
  const [farmers, setFarmers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFarmers() {
      try {
        // Using mock data instead of Firestore
        const fetchedFarmers = mockFarmers.filter(profile => profile.crops && profile.crops.length > 0);
        setFarmers(fetchedFarmers);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setError('Failed to load farmer community data.');
      } finally {
        setLoading(false);
      }
    }

    fetchFarmers();
  }, []);

  const getInitials = (name?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    return 'F';
  };
  
  const allCrops: (Crop & { farmer: UserProfile })[] = farmers.flatMap(farmer => 
    (farmer.crops || []).map(crop => ({...crop, farmer}))
  );


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

  return (
    <PublicLayout>
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Community Marketplace</h1>
                <p className="text-muted-foreground">Browse fresh produce directly from local farmers.</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for crops or farmers..." className="pl-10" />
               </div>
            </header>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                    <Leaf className="text-green-600" />
                    Available Crops
                </h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                    </div>
                ): (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {allCrops.map(crop => (
                            <Card key={`${crop.farmer.uid}-${crop.slug}`} className="overflow-hidden cursor-pointer" onClick={() => router.push(`/farmers/${crop.farmer.uid}`)}>
                               <CardContent className="p-0">
                                  <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                                      {crop.imageUrl ? (
                                        <Image src={crop.imageUrl} alt={crop.name} width={200} height={200} className="w-full h-full object-cover" />
                                      ) : crop.icon ? (
                                          <span className="text-6xl">{crop.icon}</span>
                                      ): (
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                      )}
                                  </div>
                              </CardContent>
                              <CardHeader className="p-3">
                                  <CardTitle className="text-base truncate">{crop.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">Rs. {crop.price || '??'}/40kg</p>
                                  <p className="text-xs text-muted-foreground truncate">from {crop.farmer.name}</p>
                              </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline">
                    <Truck className="text-blue-600"/>
                    Our Farmers
                </h2>
                 {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                ): (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {farmers.map(farmer => (
                             <Card key={farmer.uid}>
                                <CardContent className="pt-6 flex items-center gap-4">
                                     <Avatar className="w-16 h-16 text-2xl">
                                        <AvatarImage src={farmer.photoURL} alt={farmer.name} />
                                        <AvatarFallback>{getInitials(farmer.name)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                         <h3 className="font-bold">{farmer.name}</h3>
                                         <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{farmer.location || 'Unknown location'}</span>
                                         </div>
                                         <p className="text-xs text-muted-foreground mt-1">{farmer.crops?.length} crops listed</p>
                                      </div>
                                      <Button variant="outline" size="sm" onClick={() => router.push(`/farmers/${farmer.uid}`)}>View</Button>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                )}
            </section>

        </div>
    </PublicLayout>
  );
}
