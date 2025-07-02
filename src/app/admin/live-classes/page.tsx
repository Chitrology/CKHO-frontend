"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface LiveClass {
  id: string;
  title: string;
  dateTime: string;
  instructor: { fullName: string };
  maxCapacity: number;
  bookingsCount: number;
  isCancelled: boolean;
  bundleOfferEnabled: boolean;
}

export default function AdminLiveClassesPage() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/admin/live-classes`);
        const data = await res.json();
        setLiveClasses(data.classes || []);
      } catch (err) {
        setError('Could not fetch live classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClasses();
  }, [API_URL]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Live Classes Management</h1>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Date & Time</th>
                <th className="px-4 py-2 border">Instructor</th>
                <th className="px-4 py-2 border">Capacity</th>
                <th className="px-4 py-2 border">Booked</th>
                <th className="px-4 py-2 border">Bundle</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveClasses.map(cls => (
                <tr key={cls.id} className={cls.isCancelled ? 'bg-gray-100 text-gray-400' : ''}>
                  <td className="px-4 py-2 border font-semibold">{cls.title}</td>
                  <td className="px-4 py-2 border">{new Date(cls.dateTime).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{cls.instructor.fullName}</td>
                  <td className="px-4 py-2 border">{cls.maxCapacity}</td>
                  <td className="px-4 py-2 border">{cls.bookingsCount}</td>
                  <td className="px-4 py-2 border">{cls.bundleOfferEnabled ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-2 border">{cls.isCancelled ? 'Cancelled' : 'Active'}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link href={`/admin/live-classes/${cls.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <Link href={`/admin/live-classes/${cls.id}/bookings`} className="text-green-600 hover:underline">Bookings</Link>
                    {!cls.isCancelled && (
                      <button className="text-red-600 hover:underline" onClick={() => alert('Cancel class (stub)')}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <Link href="/admin/live-classes/new" className="bg-pink-600 text-white px-4 py-2 rounded font-semibold hover:bg-pink-700">+ Add New Live Class</Link>
      </div>
    </main>
  );
} 