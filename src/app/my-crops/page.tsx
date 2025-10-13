
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Leaf, Plus, X as XIcon, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getIconForCrop } from "@/ai/flows/get-icon-for-crop";
import type { Crop } from "@/lib/types";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { updateUserCrops } from "@/services/crop.service";

function MyCropsContent() {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [newCropName, setNewCropName] = useState("");
  const [newCropPrice, setNewCropPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sync local state when userProfile.crops changes from any source
    if (userProfile?.crops) {
      setCrops(userProfile.crops);
    } else {
      setCrops([]);
    }
  }, [userProfile?.crops]);

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

  const resetForm = () => {
      setNewCropName("");
      setNewCropPrice("");
      setImagePreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
      setIsSheetOpen(false);
  }

  const handleAddCrop = async () => {
    if (!user || !newCropName.trim()) return;

    setIsSubmitting(true);
    
    try {
        const trimmedCropName = newCropName.trim();
        const cropSlug = trimmedCropName.toLowerCase().replace(/\s+/g, '-');

        if (crops.some(crop => crop.slug === cropSlug)) {
            toast({
              variant: "destructive",
              title: "Crop already exists",
              description: `"${trimmedCropName}" is already in your list.`,
            });
            // Still need to reset submitting state on failure
            setIsSubmitting(false);
            return;
        }
        
        let newCrop: Crop = {
          name: trimmedCropName,
          slug: cropSlug,
          price: newCropPrice.trim() || undefined,
          imageUrl: imagePreview || undefined,
        };

        if (!newCrop.imageUrl) {
            try {
              const iconResult = await getIconForCrop({ cropName: trimmedCropName });
              if(iconResult.icon) {
                newCrop.icon = iconResult.icon;
              }
            } catch (aiError) {
              console.error("AI icon generation failed, proceeding without icon:", aiError);
            }
        }
        
        const updatedCrops = [...crops, newCrop];
        
        await updateUserCrops(user.uid, updatedCrops);
      
        // Fetch profile to ensure the entire app context is updated.
        // The useEffect will handle updating the local `crops` state from the new profile.
        await fetchUserProfile(user);

        toast({
            title: "Crop Added",
            description: `"${trimmedCropName}" has been added to your profile.`,
        });
        
        resetForm();
        
    } catch (error: any) {
      toast({
          variant: "destructive",
          title: "Error adding crop",
          description: error.message || "Could not add the crop. Please try again.",
      });
    } finally {
      // This will run regardless of success or failure
      setIsSubmitting(false);
    }
  };

  const handleRemoveCrop = async (cropToRemove: Crop) => {
    if (!user) return;
    
    // Prevent multiple clicks while processing
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
        const updatedCrops = crops.filter(crop => crop.slug !== cropToRemove.slug);
        
        await updateUserCrops(user.uid, updatedCrops);
        
        // Fetch profile to get the latest source of truth.
        // The useEffect will handle updating the local state.
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
        // CRITICAL FIX: The component was getting stuck because this was not being called.
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">My Crops</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Crop
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add a New Crop</SheetTitle>
              <SheetDescription>
                Add a crop to your profile to track its price and receive relevant advisories.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground">Crop Name</label>
                 <Input 
                      placeholder="e.g., Wheat"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      disabled={isSubmitting}
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Price (per 40kg, optional)</label>
                <Input 
                      placeholder="e.g., 2400"
                      value={newCropPrice}
                      onChange={(e) => setNewCropPrice(e.target.value)}
                      disabled={isSubmitting}
                      type="number"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Image (optional)</label>
                {imagePreview ? (
                    <div className="relative w-32 h-32">
                        <Image src={imagePreview} alt="Preview" width={128} height={128} className="rounded-md object-cover" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={() => setImagePreview(null)}>
                            <XIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isSubmitting} className="w-full">
                     <Upload className="mr-2 h-4 w-4" />
                     Upload Image
                  </Button>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </SheetClose>
              <Button onClick={handleAddCrop} disabled={isSubmitting || !newCropName.trim()}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Crop"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

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
                    <p>You haven't added any crops to your profile yet. Add your first crop to get started.</p>
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

    