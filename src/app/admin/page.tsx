"use client";
import React, { useState, useEffect } from "react";
import { Users, BookOpen, IndianRupee, ShoppingCart } from "lucide-react";
import axiosWithAuth from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow border">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-pink-100 text-pink-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    purchases: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // In a real app, you'd fetch this from a dedicated stats endpoint
      // For now, we can simulate or fetch from multiple endpoints
      try {
        const [usersRes, coursesRes] = await Promise.all([
          axiosWithAuth.get("/api/users"), // Assuming this endpoint exists and returns a count
          axiosWithAuth.get("/api/courses"), // Assuming this returns a count
        ]);
        setStats({
          users: usersRes.data.totalUsers || usersRes.data.users?.length || 0,
          courses: coursesRes.data.totalCourses || coursesRes.data.courses?.length || 0,
          purchases: 120, // Placeholder
          revenue: 56000, // Placeholder
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName || user?.email}!</h1>
      <p className="mt-2 text-lg text-gray-600">Here's a snapshot of your platform's performance.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.users.toString()} icon={Users} />
        <StatCard title="Total Courses" value={stats.courses.toString()} icon={BookOpen} />
        <StatCard title="Total Sales" value={stats.purchases.toString()} icon={ShoppingCart} />
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={IndianRupee} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="mt-2 text-sm text-gray-500">A list of recent user registrations or course enrollments will appear here.</p>
          {/* Activity list would go here */}
        </div>

        {/* Quick Reports Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold">Quick Reports</h3>
          <p className="mt-2 text-sm text-gray-500">Links to generate common reports.</p>
          {/* Report links would go here */}
        </div>
      </div>
    </div>
  );
} 