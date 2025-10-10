
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Leaf, Plus, X as XIcon, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getIconForCrop } from "@/ai/flows/get-icon-for-crop";
import type { Crop } from "@/lib/types";
import Image from "next/image";

function MyCropsContent() {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const [newCropName, setNewCropName] = useState("");
  const [newCropPrice, setNewCropPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    if (userProfile?.crops) {
      setCrops(userProfile.crops);
    } else {
      setCrops([]);
    }
  }, [userProfile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCrop = async () => {
    if (!user || !newCropName.trim()) return;

    const trimmedCropName = newCropName.trim();
    const cropSlug = trimmedCropName.toLowerCase().replace(/\s+/g, '-');

    if (crops.some(crop => crop.slug === cropSlug)) {
        toast({
            variant: "destructive",
            title: "Crop already exists",
            description: `"${trimmedCropName}" is already in your list.`,
        });
        return;
    }

    setIsSubmitting(true);
    try {
        let newCrop: Crop = {
          name: trimmedCropName,
          slug: cropSlug,
          price: newCropPrice.trim() || undefined,
          imageUrl: imagePreview || undefined,
        };

        if (!imagePreview) {
          const iconResult = await getIconForCrop({ cropName: trimmedCropName });
          newCrop.icon = iconResult.icon;
        }
        
        const updatedCrops = [...crops, newCrop];
        
        await setDoc(doc(db, "users", user.uid), { crops: updatedCrops }, { merge: true });
        
        await fetchUserProfile(user);
        
        toast({
            title: "Crop Added",
            description: `"${trimmedCropName}" has been added to your profile.`,
        });
        
        setNewCropName("");
        setNewCropPrice("");
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error adding crop",
            description: error.message || "Could not add the crop. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleRemoveCrop = async (cropToRemove: Crop) => {
    if (!user) return;

    setIsSubmitting(true); 
    try {
        const updatedCrops = crops.filter(crop => crop.slug !== cropToRemove.slug);
        await setDoc(doc(db, "users", user.uid), { crops: updatedCrops }, { merge: true });
        
        await fetchUserProfile(user);
        
        toast({
            title: "Crop Removed",
            description: `"${cropToRemove.name}" has been removed from your profile.`,
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error removing crop",
            description: error.message || "Could not remove the crop. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">My Crops</h1>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Plus className="text-primary" />
                Add a New Crop
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Input 
                    placeholder="Crop Name, e.g., Wheat"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    disabled={isSubmitting}
                />
                 <Input 
                    placeholder="Price (per 40kg), e.g., 2400"
                    value={newCropPrice}
                    onChange={(e) => setNewCropPrice(e.target.value)}
                    disabled={isSubmitting}
                    type="number"
                />
            </div>
             <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isSubmitting} className="w-full sm:w-auto">
                   <Upload className="mr-2 h-4 w-4" />
                   Upload Image (Optional)
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            {imagePreview && (
                <div className="relative w-32 h-32">
                    <Image src={imagePreview} alt="Preview" width={128} height={128} className="rounded-md object-cover" />
                    <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={() => setImagePreview(null)}>
                        <XIcon className="h-4 w-4"/>
                    </Button>
                </div>
            )}
             <Button onClick={handleAddCrop} disabled={isSubmitting || !newCropName.trim()} className="w-full sm:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Crop"}
            </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Leaf className="text-green-600" />
            Your Registered Crops
        </h2>
        {crops.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {crops.map((crop) => (
                <Card key={crop.slug} className="group relative overflow-hidden">
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
                    <CardFooter className="p-3 bg-white/80 backdrop-blur-sm flex-col items-start">
                        <p className="font-semibold w-full truncate">{crop.name}</p>
                         {crop.price && <p className="text-sm text-muted-foreground">Rs. {crop.price} / 40kg</p>}
                    </CardFooter>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveCrop(crop)} 
                            disabled={isSubmitting}
                            className="w-8 h-8"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                    </div>
                </Card>
              ))}
            </div>
          ) : (
             <Card>
                <CardContent className="pt-6">
                    <p>You haven't added any crops to your profile yet. Add your first crop above.</p>
                </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

export default function MyCropsPage() {
  return (
    <AppLayout>
      <MyCropsContent />
    </AppLayout>
  );
}
