import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

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

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
        <img
          src={course.thumbnail || '/placeholder-image.svg'}
          alt={`Thumbnail for ${course.title}`}
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600">{course.title}</h3>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">{course.level}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1">{course.avgRating?.toFixed(1) || 'N/A'} ({course._count?.reviews || 0})</span>
            </div>
          </div>
          <p className="mt-4 text-xl font-bold text-gray-900">₹{course.priceBuy}</p>
        </div>
      </div>
    </Link>
  );
} 