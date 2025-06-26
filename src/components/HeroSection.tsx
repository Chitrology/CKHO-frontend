import React from 'react';
import Link from 'next/link';
import { PlayCircle, Rocket } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text and CTA */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-800 md:text-5xl mb-6">
              Master the Art of Beauty and Makeup
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Unlock your potential with expert-led online courses. From beginner basics to advanced techniques, start your journey with CKHO today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/courses" className="flex items-center justify-center rounded-md bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-500">
                <Rocket className="mr-2 h-5 w-5" />
                Explore Courses
              </Link>
              <Link href="#recent-courses" className="flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-sm font-semibold text-pink-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Preview
              </Link>
            </div>
          </div>

          {/* Right: Images */}
          <div className="relative flex justify-center lg:justify-end bg-gray-50 rounded-xl p-6">
            {/* Main image */}
            <img
              src="/placeholder-image.svg"
              alt="Makeup course promo"
              className="w-72 h-72 object-cover rounded-xl shadow-lg z-10"
            />
            {/* Overlapping smaller image */}
            <img
              src="/globe.svg"
              alt="Decorative"
              className="absolute bottom-0 left-0 w-32 h-32 object-cover rounded-lg shadow-md -mb-8 -ml-8 z-0 opacity-80"
            />
            {/* Another decorative image */}
            <img
              src="/window.svg"
              alt="Decorative"
              className="absolute top-0 right-0 w-20 h-20 object-cover rounded-lg shadow-md -mt-6 -mr-6 z-0 opacity-70"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 