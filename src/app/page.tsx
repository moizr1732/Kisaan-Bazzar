
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Kisan Bazaar</CardTitle>
          <CardDescription>Are you a farmer or a buyer?</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => router.push("/login")}
          >
            <Leaf className="h-8 w-8 text-green-600" />
            <span>I'm a Farmer</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => router.push("/community")}
          >
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span>I'm a Buyer</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
