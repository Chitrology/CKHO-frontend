import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'MENTOR']}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-6 bg-white">{children}</div>
      </div>
    </ProtectedRoute>
  );
} 