"use client";
import React, { useEffect, useState } from "react";
import LiveClassList from '@/components/LiveClassList';

export default function DashboardPage() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMyLiveClasses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/live-classes/my/bookings`);
        const data = await res.json();
        setLiveClasses(data.classes || []);
      } catch (err) {
        setError('Could not fetch your live classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyLiveClasses();
  }, []);

  return (
    <main className="min-h-[60vh] flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      <section className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-4">My Live Classes</h3>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <LiveClassList classes={liveClasses} />
        )}
      </section>
    </main>
  );
} 