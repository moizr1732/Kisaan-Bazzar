"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { DiagnosisModal } from "@/components/dashboard/DiagnosisModal";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Advisory } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [latestAdvisory, setLatestAdvisory] = useState<Advisory | null>(null);
  const [loadingAdvisory, setLoadingAdvisory] = useState(true);

  useEffect(() => {
    async function fetchLatestAdvisory() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "advisories"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const advisoryDoc = querySnapshot.docs[0];
          setLatestAdvisory({ id: advisoryDoc.id, ...advisoryDoc.data() } as Advisory);
        }
      } catch (error) {
        console.error("Error fetching latest advisory:", error);
      } finally {
        setLoadingAdvisory(false);
      }
    }
    fetchLatestAdvisory();
  }, [user]);

  const onAdvisoryCreated = (newAdvisory: Advisory) => {
    setLatestAdvisory(newAdvisory);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)} className="font-bold">
          <Mic className="mr-2 h-4 w-4" />
          Get New Crop Diagnosis
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Advisory</CardTitle>
          <CardDescription>
            Here is the most recent recommendation for your crops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAdvisory ? (
            <p>Loading latest advisory...</p>
          ) : latestAdvisory ? (
            <div>
              <p className="text-sm text-muted-foreground">
                Received {formatDistanceToNow(latestAdvisory.createdAt.toDate(), { addSuffix: true })}
              </p>
              <p className="mt-2 text-lg">{latestAdvisory.diagnosis}</p>
            </div>
          ) : (
            <p>No advisories found. Get your first diagnosis!</p>
          )}
        </CardContent>
      </Card>
      
      <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={onAdvisoryCreated} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </AuthGuard>
  );
}
