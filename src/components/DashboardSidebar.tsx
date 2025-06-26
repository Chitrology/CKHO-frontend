"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  CreditCard,
  Bell,
  LogOut,
  LifeBuoy,
  Settings,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
  { href: "/dashboard/certification", label: "Certification", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

const bottomLinks = [
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/profile", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <Link href="/">
          <h2 className="text-2xl font-bold text-pink-600">CKHO</h2>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              pathname === link.href ? "bg-pink-50 text-pink-600 font-semibold" : ""
            }`}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
         {bottomLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              pathname.startsWith(link.href) ? "bg-pink-50 text-pink-600 font-semibold" : ""
            }`}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
        <div className="p-4 mt-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm">New features available!</h4>
          <p className="text-xs text-gray-500 mt-1">Check out the new dashboard pages.</p>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <img src={user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`} alt="User avatar" className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="font-semibold text-sm">{user?.fullName || user?.email}</div>
            <button onClick={signOut} className="text-xs text-pink-600 hover:underline">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
} 