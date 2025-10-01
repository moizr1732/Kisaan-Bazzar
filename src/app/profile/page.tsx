"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
  location: z.string().max(100, "Location is too long").optional(),
  language: z.enum(["en", "ur", "pa", "sd", "ps"]),
  crops: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileContent() {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      location: "",
      language: "en",
      crops: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        location: userProfile.location || "",
        language: userProfile.language || "en",
        crops: userProfile.crops?.join(", ") || "",
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        ...userProfile,
        name: data.name,
        location: data.location,
        language: data.language,
        crops: data.crops?.split(",").map(c => c.trim()).filter(Boolean) || [],
      };
      await setDoc(doc(db, "users", user.uid), updatedProfile);
      await fetchUserProfile(user);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ali Ahmed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Village</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chak 5, Okara" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="pa">Punjabi</SelectItem>
                        <SelectItem value="sd">Sindhi</SelectItem>
                        <SelectItem value="ps">Pashto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crops You Grow</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g. Wheat, Cotton, Sugarcane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
      <AppLayout>
        <ProfileContent />
      </AppLayout>
  );
}
