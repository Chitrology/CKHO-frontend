"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { href: "/admin/users", label: "Users Management" },
  { href: "/admin/courses", label: "Courses Management" },
  { href: "/admin/live-classes", label: "Live Classes Management" },
  { href: "/admin/reports", label: "Reports & Analytics" },
  { href: "/admin/settings", label: "Platform Settings" },
  { href: "/admin/support", label: "Support Tickets" },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-gray-800 text-white p-4 flex flex-col gap-2 justify-between">
      <div>
        <h3 className="text-lg font-bold mb-4 text-pink-400">Admin Panel</h3>
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
              pathname === link.href ? "bg-pink-600 font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {user && (
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-400">Logged in as Admin</p>
          <button
            onClick={signOut}
            className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
} 