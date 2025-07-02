"use client";
import React, { useEffect, useState } from "react";
import axiosWithAuth, { getErrorMessage } from "@/utils/axios";
import LiveClassTabs from '@/components/LiveClassTabs';
import { Search } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  priceBuy: number;
  tags?: string[];
  thumbnail?: string;
  _count?: {
    reviews: number;
  };
  avgRating?: number; 
}

interface LiveClass {
  id: string;
  title: string;
  dateTime: string;
  instructor: { fullName: string; avatarUrl?: string };
  priceStandard: number;
  priceEarlyBird: number;
  earlyBirdStart: string;
  earlyBirdEnd: string;
  remainingSeats: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [coursesRes, liveClassesRes] = await Promise.all([
          axiosWithAuth.get("/api/courses?status=PUBLISHED&limit=50"),
          fetch(`${API_URL}/api/live-classes`).then(res => res.json()),
        ]);
        setCourses(coursesRes.data.courses || []);
        setLiveClasses(liveClassesRes.classes || []);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLiveClasses = liveClasses.filter((cls) =>
    cls.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Courses Catalog</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find your next learning opportunity. Browse our collection of expert-led courses designed to help you master the art of beauty and makeup.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-16 mx-auto max-w-2xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search courses or live classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border-0 bg-white py-3 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Tabs for All / Pre-recorded / Live Classes */}
        <div className="mx-auto mt-16">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <LiveClassTabs
              liveClasses={filteredLiveClasses}
              preRecordedCourses={filteredCourses}
            />
          )}
        </div>
      </div>
    </div>
  );
} 