"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient";
import axiosInstance from "@/utils/axios";
import { useRouter, usePathname } from "next/navigation";

type UserRole = 'ADMIN' | 'MENTOR' | 'STUDENT';

// This now represents the full user profile from our backend
interface ExtendedUser {
  id: string;
  role: UserRole;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  // Add any other fields from your User model you might need
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch full user profile from backend
  const fetchUserProfile = async (userId: string): Promise<ExtendedUser | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      const response = await axiosInstance.get(`/api/users/supabase/${userId}`);
      console.log('User profile response:', response.data);
      return response.data; // The backend should return the full user object
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // It's crucial to sign out if the backend profile doesn't exist
      // to prevent being logged in to Supabase but not our app.
      await supabase.auth.signOut();
      return null;
    }
  };

  // Handle role-based routing
  const handleRoleBasedRouting = (role: UserRole | undefined) => {
    if (!role) return;

    console.log('Handling role-based routing:', { role, pathname });
    const isAdmin = role === 'ADMIN';
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
  };

  // This effect runs once to set up the auth listener and get the initial session.
  useEffect(() => {
    setLoading(true);

    const updateUserState = async (session: Session | null) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
        if (userProfile) {
          handleRoleBasedRouting(userProfile.role);
        }
      } else {
        setUser(null);
      }
      setSession(session);
    };

    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserState(session);
      setLoading(false);
    });

    // Handle auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserState(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // This effect handles role-based routing whenever the user or path changes.
  useEffect(() => {
    if (loading) return; // Don't run routing logic until auth state is determined

    if (user?.role) {
      handleRoleBasedRouting(user.role);
    } else if (!user && !['/auth', '/'].includes(pathname)) {
      // Allow access to public-facing routes like landing page, /courses, etc.
      // Define public paths that don't require auth
      const publicPaths = ['/auth', '/', '/courses', '/contact', '/faq'];
      const isPublic = publicPaths.some(p => pathname.startsWith(p));
      
      if (!isPublic) {
        router.replace('/auth');
      }
    }
  }, [user, pathname, loading, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.replace('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
} 