import React from 'react';
import { Award, Video, Users, LifeBuoy } from 'lucide-react';

const features = [
  {
    name: 'Expert Instructors',
    description: 'Learn from the best in the industry. Our instructors are certified professionals with years of real-world experience.',
    icon: Award,
  },
  {
    name: 'Flexible Learning',
    description: 'Access your courses anytime, anywhere. Our platform is fully responsive and works on all devices.',
    icon: Video,
  },
  {
    name: 'Community Support',
    description: 'Join a vibrant community of fellow learners and mentors. Share your work, get feedback, and grow together.',
    icon: Users,
  },
    {
    name: 'Career Opportunities',
    description: 'We connect our top students with leading brands and salons for exclusive job opportunities.',
    icon: LifeBuoy,
  },
];

export default function WhyUsSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold leading-7 text-pink-600">Why Choose CKHO?</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Everything you need to master your craft
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide a comprehensive learning ecosystem that goes beyond just video tutorials. 
            We are committed to your success.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 bg-gray-50 rounded-xl p-6 shadow-sm">
                <dt className="text-base font-semibold leading-7 text-gray-800">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 