"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          CKHO
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <Link href="/courses" className="hover:text-pink-600">Courses</Link>
          <Link href="/marketplace" className="hover:text-pink-600">Marketplace</Link>
          {!user && <Link href="/auth" className="hover:text-pink-600">Login</Link>}
          {user && <Link href="/dashboard" className="hover:text-pink-600">Dashboard</Link>}
          {user && (
            <button
              onClick={signOut}
              className="ml-4 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
