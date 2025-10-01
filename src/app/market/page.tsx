"use client";

import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const marketData = [
  { crop: "Wheat", price: "2,500", unit: "40 kg" },
  { crop: "Cotton", price: "8,000", unit: "40 kg" },
  { crop: "Sugarcane", price: "300", unit: "40 kg" },
  { crop: "Rice (Basmati)", price: "7,000", unit: "40 kg" },
  { crop: "Rice (Irri-6)", price: "3,500", unit: "40 kg" },
  { crop: "Maize", price: "2,200", unit: "40 kg" },
];

function MarketContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Market Prices</h1>
      <Card>
        <CardHeader>
          <CardTitle>Today's Crop Prices</CardTitle>
          <CardDescription>
            Live prices from the local mandi (market).
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Crop</TableHead>
                        <TableHead className="text-right">Price (PKR)</TableHead>
                        <TableHead className="text-right">Per Unit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {marketData.map((item) => (
                        <TableRow key={item.crop}>
                            <TableCell className="font-medium">{item.crop}</TableCell>
                            <TableCell className="text-right">{item.price}</TableCell>
                            <TableCell className="text-right">{item.unit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MarketPage() {
    return (
        <AuthGuard>
            <AppLayout>
                <MarketContent />
            </AppLayout>
        </AuthGuard>
    )
}