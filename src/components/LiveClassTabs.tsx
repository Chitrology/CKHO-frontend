import React, { useState } from 'react';
import LiveClassList from './LiveClassList';
import CourseCard from './CourseCard';

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

interface Course {
  id: string;
  title: string;
  description: string;
  // ...other fields
}

interface LiveClassTabsProps {
  liveClasses: LiveClass[];
  preRecordedCourses: Course[];
  onBookLiveClass?: (id: string) => void;
}

const LiveClassTabs: React.FC<LiveClassTabsProps> = ({ liveClasses, preRecordedCourses, onBookLiveClass }) => {
  const [tab, setTab] = useState<'all' | 'pre-recorded' | 'live'>('all');

  return (
    <div>
      <div className="flex gap-4 border-b mb-4">
        <button
          className={`py-2 px-4 font-semibold ${tab === 'all' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
          onClick={() => setTab('all')}
        >
          All
        </button>
        <button
          className={`py-2 px-4 font-semibold ${tab === 'pre-recorded' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
          onClick={() => setTab('pre-recorded')}
        >
          Pre-recorded
        </button>
        <button
          className={`py-2 px-4 font-semibold ${tab === 'live' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
          onClick={() => setTab('live')}
        >
          Live Classes
        </button>
      </div>
      {tab === 'all' && (
        <>
          <LiveClassList classes={liveClasses} onBook={onBookLiveClass} />
          <div className="my-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preRecordedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  priceBuy: (course as any).priceBuy ?? 0,
                  level: (course as any).level ?? '',
                }}
              />
            ))}
          </div>
        </>
      )}
      {tab === 'pre-recorded' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preRecordedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                priceBuy: (course as any).priceBuy ?? 0,
                level: (course as any).level ?? '',
              }}
            />
          ))}
        </div>
      )}
      {tab === 'live' && <LiveClassList classes={liveClasses} onBook={onBookLiveClass} />}
    </div>
  );
};

export default LiveClassTabs; 