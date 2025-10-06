
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Advisory } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

function HistoryContent() {
  const { user } = useAuth();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdvisories() {
      if (!user) {
        setLoading(false);
        return;
      };
      try {
        const q = query(
          collection(db, "advisories"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedAdvisories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Advisory[];
        setAdvisories(fetchedAdvisories);
      } catch (error) {
        console.error("Error fetching advisories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdvisories();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Advisory History</h1>
      {loading ? (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      ) : advisories.length > 0 ? (
        <div className="space-y-4">
          {advisories.map((advisory) => (
            <Card key={advisory.id}>
              <CardHeader>
                <CardTitle>Diagnosis from {advisory.createdAt ? format(advisory.createdAt.toDate(), "PPP") : 'N/A'}</CardTitle>
                 <CardDescription>At {advisory.createdAt ? format(advisory.createdAt.toDate(), "p") : ''}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{advisory.diagnosis}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="pt-6">
                <p>You have no past advisories. Get your first diagnosis from the dashboard.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
      <AppLayout>
        <HistoryContent />
      </AppLayout>
  );
}

    