"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import DashboardPage from './dashboard/page';

export default function HomePage() {
  // Wrap with a temporary "mock" AuthProvider to bypass login for display
  return (
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  );
}
