
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Plus, X as XIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function MyCropsContent() {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const [newCrop, setNewCrop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const crops = userProfile?.crops || [];

  const handleAddCrop = async () => {
    if (!user || !newCrop.trim()) return;

    const trimmedCrop = newCrop.trim();
    if (crops.includes(trimmedCrop)) {
        toast({
            variant: "destructive",
            title: "Crop already exists",
            description: `"${trimmedCrop}" is already in your list.`,
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const updatedCrops = [...crops, trimmedCrop];
        await setDoc(doc(db, "users", user.uid), { crops: updatedCrops }, { merge: true });
        await fetchUserProfile(user);
        toast({
            title: "Crop Added",
            description: `"${trimmedCrop}" has been added to your profile.`,
        });
        setNewCrop("");
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

  const handleRemoveCrop = async (cropToRemove: string) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
        const updatedCrops = crops.filter(crop => crop !== cropToRemove);
        await setDoc(doc(db, "users", user.uid), { crops: updatedCrops }, { merge: true });
        await fetchUserProfile(user);
        toast({
            title: "Crop Removed",
            description: `"${cropToRemove}" has been removed from your profile.`,
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
        <CardContent>
            <div className="flex gap-2">
                <Input 
                    placeholder="e.g., Wheat"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    disabled={isSubmitting}
                />
                <Button onClick={handleAddCrop} disabled={isSubmitting || !newCrop.trim()}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Add Crop"}
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="text-green-600" />
            Your Registered Crops
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crops.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {crops.map((crop) => (
                <Badge
                  key={crop}
                  variant="outline"
                  className="text-lg px-4 py-2 bg-green-50 border-green-200 text-green-800 relative group"
                >
                  {crop}
                  <button 
                    onClick={() => handleRemoveCrop(crop)} 
                    disabled={isSubmitting}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p>
              You haven't added any crops to your profile yet. Add your first crop above.
            </p>
          )}
        </CardContent>
      </Card>
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
