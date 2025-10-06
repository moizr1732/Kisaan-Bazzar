
"use client";

import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function MyCropsContent() {
  const { userProfile } = useAuth();

  const crops = userProfile?.crops || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">My Crops</h1>
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
                  className="text-lg px-4 py-2 bg-green-50 border-green-200 text-green-800"
                >
                  {crop}
                </Badge>
              ))}
            </div>
          ) : (
            <p>
              You haven't added any crops to your profile yet. Go to your
              profile to add the crops you are growing.
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
