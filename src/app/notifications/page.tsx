
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

function NotificationsContent() {
  const notifications = [
    { id: 1, title: "Weather Alert", message: "Expect heavy rain tomorrow in your area.", time: "1h ago", read: false },
    { id: 2, title: "Market Update", message: "Wheat prices have increased by 5% in the main market.", time: "3h ago", read: false },
    { id: 3, title: "New Advisory", message: "A new advisory for your cotton crop is available.", time: "1d ago", read: true },
  ]
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Notifications</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-secondary'}`}>
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You have no new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NotificationsPage() {
    return (
        <AppLayout>
            <NotificationsContent />
        </AppLayout>
    );
}
