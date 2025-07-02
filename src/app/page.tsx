"use client";
import HeroSection from '@/components/HeroSection';
import RecentCourses from '@/components/RecentCourses';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import LiveClassList from '@/components/LiveClassList';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/live-classes`);
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
    <main>
      <HeroSection />
      {/* Upcoming Live Classes Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Live Classes</h2>
            <p className="mt-2 text-gray-600">Book your spot in our next live session!</p>
          </div>
          {loading && <div className="text-center text-gray-500">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <>
              <LiveClassList classes={liveClasses.slice(0, 3)} />
              {liveClasses.length > 3 && (
                <div className="text-center mt-6">
                  <Link href="/courses" className="text-pink-600 font-semibold hover:underline">See all live classes</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <RecentCourses />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
