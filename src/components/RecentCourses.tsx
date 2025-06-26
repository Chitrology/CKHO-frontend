"use client";

import React, { useState, useEffect } from 'react';
import axiosWithAuth from '@/utils/axios';
import CourseCard from './CourseCard';
import { Loader } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  priceBuy: number;
  level: string;
  avgRating?: number;
  _count?: {
    reviews?: number;
  };
}

export default function RecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosWithAuth.get('/api/courses/recent');
        setCourses(response.data);
      } catch (err) {
        setError('Could not fetch recent courses. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCourses();
  }, []);

  return (
    <section id="recent-courses" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Explore Our Latest Courses
          </h2>
          <p className="mt-4 text-gray-600">
            Hand-picked and freshly-baked for your learning pleasure.
          </p>
        </div>
        {loading && (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-pink-600" />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 