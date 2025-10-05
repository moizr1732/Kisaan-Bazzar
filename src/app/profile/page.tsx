
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Settings, Home, BotMessageSquare, Leaf, BarChart3, UserCircle, Camera, X as XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { DiagnosisModal } from "@/components/dashboard/DiagnosisModal";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
  location: z.string().max(100, "Location is too long").optional(),
  phoneNumber: z.string().optional(),
  language: z.enum(["en", "ur", "pa", "sd", "ps"]),
  crops: z.array(z.string()).optional(),
  farmSize: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive("Farm size must be a positive number.").optional()
  ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileContent() {
  const { user, userProfile, fetchUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropInput, setCropInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      location: "",
      phoneNumber: "",
      language: "en",
      crops: [],
      farmSize: undefined,
    },
  });

  const { watch, setValue, getValues } = form;
  const crops = watch("crops") || [];

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        location: userProfile.location || "",
        phoneNumber: userProfile.phoneNumber || "",
        language: userProfile.language || "en",
        crops: userProfile.crops || [],
        farmSize: userProfile.farmSize || undefined,
      });
      if (userProfile.photoURL) {
        setAvatarPreview(userProfile.photoURL);
      }
    }
  }, [userProfile, form]);
  
  const handleAddCrop = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cropInput.trim() !== "") {
        e.preventDefault();
        const currentCrops = getValues("crops") || [];
        if (!currentCrops.includes(cropInput.trim())) {
            setValue("crops", [...currentCrops, cropInput.trim()]);
        }
        setCropInput("");
    }
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    const currentCrops = getValues("crops") || [];
    setValue("crops", currentCrops.filter(crop => crop !== cropToRemove));
  };


  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to update your profile.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        name: data.name,
        location: data.location,
        phoneNumber: data.phoneNumber,
        language: data.language,
        crops: data.crops,
        farmSize: data.farmSize,
      };

      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      await fetchUserProfile(user); // Refetch profile to update context
      
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'A';
  }

  const handleCancel = () => {
    router.back();
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // NOTE: In a real app, you would upload the file to a service like Firebase Storage
        // and then save the URL to the user's profile.
        // For this demo, we're just showing a local preview.
        // To make it persistent, you'd add something like:
        // const storageRef = ref(storage, `avatars/${user.uid}`);
        // await uploadString(storageRef, reader.result as string, 'data_url');
        // const photoURL = await getDownloadURL(storageRef);
        // await setDoc(doc(db, "users", user.uid), { photoURL }, { merge: true });
        // await fetchUserProfile(user);
        toast({
          title: "Photo Selected",
          description: "Click 'Save Changes' to update your profile. Photo upload is for demonstration.",
        });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
     <div className="bg-background min-h-screen">
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-sm">
        <h1 className="text-xl font-bold">Farmer Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
          <Settings />
        </Button>
      </header>

      <main className="p-4 space-y-6">
        <div className="flex flex-col items-center space-y-2">
            <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="text-3xl">{getInitials(userProfile?.name, user?.email)}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary text-primary-foreground" onClick={handleAvatarClick}>
                    <Camera className="w-4 h-4"/>
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <p className="text-sm text-muted-foreground">Tap to change photo</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="Muhammad Ali" />}
              />
              {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
            </div>

             <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="Lahore, Punjab" />}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="+92 300 1234567" />}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Crops Grown</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {crops.map(crop => (
                   <Badge key={crop} variant="secondary" className="bg-green-100 text-green-800">
                     {crop}
                     <button type="button" onClick={() => handleRemoveCrop(crop)} className="ml-2">
                       <XIcon className="h-3 w-3"/>
                     </button>
                   </Badge>
                ))}
              </div>
               <Input 
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                onKeyDown={handleAddCrop}
                placeholder="Add more crops and press Enter..."
               />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
              <Controller
                  name="language"
                  control={form.control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="pa">Punjabi</SelectItem>
                        <SelectItem value="sd">Sindhi</SelectItem>
                        <SelectItem value="ps">Pashto</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Farm Size (Acres)</label>
              <Controller
                  name="farmSize"
                  control={form.control}
                  render={({ field }) => <Input {...field} type="number" placeholder="15" value={field.value ?? ''} />}
              />
               {form.formState.errors.farmSize && <p className="text-xs text-destructive mt-1">{form.formState.errors.farmSize.message}</p>}
            </div>

            <div className="pt-4 space-y-2">
                <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </form>
      </main>

       {/* Bottom Navigation */}
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
          <Button variant="ghost" className="flex flex-col h-16 text-primary" onClick={() => router.push('/profile')}>
              <UserCircle />
              <span className="text-xs">Profile</span>
          </Button>
      </nav>

       {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden" />

      <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={() => {}} />

    </div>
  );
}

export default function ProfilePage() {
    return <ProfileContent />
}
