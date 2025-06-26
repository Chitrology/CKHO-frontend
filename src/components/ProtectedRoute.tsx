"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type UserRole = 'ADMIN' | 'MENTOR' | 'STUDENT';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute state:', { user, pathname, allowedRoles });
      
      if (!user) {
        console.log('No user found, redirecting to /auth');
        router.replace("/auth");
      } else if (user.role) {
        // Handle role-based routing
        console.log('Checking role-based access:', { userRole: user.role, allowedRoles });
        
        const isAdmin = user.role === 'ADMIN';
        const isAdminRoute = pathname?.startsWith('/admin');
        const isDashboardRoute = pathname?.startsWith('/dashboard');

        console.log('Route conditions:', { isAdmin, isAdminRoute, isDashboardRoute });

        if (isAdmin && isDashboardRoute) {
          console.log('Admin accessing dashboard route, redirecting to /admin');
          router.replace("/admin");
        } else if (!isAdmin && isAdminRoute) {
          console.log('Non-admin accessing admin route, redirecting to /dashboard');
          router.replace("/dashboard");
        }
      }
    }
  }, [user, loading, router, pathname, allowedRoles]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // If roles are specified and user's role is not included, show access denied
  if (allowedRoles && user.role && !allowedRoles.includes(user.role as UserRole)) {
    console.log('Access denied:', { userRole: user.role, allowedRoles });
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
} 