
'use client';

import { useEffect, useState } from 'react';
import type { UserProfile, Crop } from '@/lib/types';
import PublicLayout from '@/components/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Phone, MessageSquare, Leaf, Languages, Info, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { mockFarmers } from '@/lib/mock-data';
import { placeholderImages } from '@/lib/placeholder-images.json';

interface FarmerProfilePageProps {
  params: {
    uid: string;
  };
}

export default function FarmerProfilePage({ params }: FarmerProfilePageProps) {
  const [farmerProfile, setFarmerProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { uid } = params;

  useEffect(() => {
    async function fetchFarmerProfile() {
      if (!uid) {
        setError('Farmer ID is missing.');
        setLoading(false);
        return;
      }
      try {
        // Using mock data instead of Firestore
        const profile = mockFarmers.find(f => f.uid === uid);
        if (profile) {
          setFarmerProfile(profile);
        } else {
          setError('Farmer not found.');
        }
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
        setError('Failed to load farmer profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchFarmerProfile();
  }, [uid]);

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'F';
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PublicLayout>
    );
  }

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
  
  const languageMap: {[key: string]: string} = {en: 'English', ur: 'Urdu', pa: 'Punjabi', si: 'Sindhi', ps: 'Pashto'};

  const cropsWithImages = farmerProfile?.crops?.map(crop => {
      const imageInfo = placeholderImages.find(p => p.id === crop.slug);
      return {
          ...crop,
          imageUrl: imageInfo?.imageUrl,
          imageHint: imageInfo?.imageHint,
      }
  }) || [];

  return (
    <PublicLayout>
      {farmerProfile && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 text-4xl">
                <AvatarImage src={farmerProfile.photoURL} alt={farmerProfile.name} />
                <AvatarFallback>{getInitials(farmerProfile.name, farmerProfile.email)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold font-headline">{farmerProfile.name}</h1>
                {farmerProfile.location && (
                  <div className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{farmerProfile.location}</span>
                  </div>
                )}
                 {farmerProfile.language && (
                  <div className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Languages className="w-4 h-4" />
                    <span>{languageMap[farmerProfile.language] || 'Not specified'}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button><MessageSquare className="mr-2" /> Message</Button>
                {farmerProfile.phoneNumber && <Button variant="outline"><Phone className="mr-2" /> Call</Button>}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="text-primary"/>
                About {farmerProfile.name?.split(' ')[0]}
              </CardTitle>
            </CardHeader>
            <CardContent>
                {farmerProfile.farmSize ? (
                    <p>Farm Size: {farmerProfile.farmSize} acres</p>
                ) : (
                    <p className="text-muted-foreground">Farm size not specified.</p>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="text-green-600" />
                Crops for Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cropsWithImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cropsWithImages.map((crop: any) => (
                    <Card key={crop.slug} className="overflow-hidden">
                       <CardContent className="p-0">
                          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                              {crop.imageUrl ? (
                                <Image 
                                    src={crop.imageUrl} 
                                    alt={crop.name} 
                                    width={200} 
                                    height={200} 
                                    className="w-full h-full object-cover" 
                                    data-ai-hint={crop.imageHint}
                                />
                              ) : crop.icon ? (
                                  <span className="text-6xl">{crop.icon}</span>
                              ): (
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                              )}
                          </div>
                      </CardContent>
                      <CardFooter className="p-3 bg-white/80 backdrop-blur-sm flex-col items-start">
                          <p className="font-semibold w-full truncate">{crop.name}</p>
                          {crop.price && <p className="text-sm text-muted-foreground">Rs. {crop.price} / 40kg</p>}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">This farmer has not listed any crops yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PublicLayout>
  );
}
