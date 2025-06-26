import React from 'react';

const testimonials = [
  {
    body: 'This platform transformed my career. The instructors are top-notch and the community is so supportive. I landed my dream job at a high-end salon thanks to CKHO!',
    author: {
      name: 'Priya Sharma',
      handle: 'MUA, Mumbai',
      imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
    },
  },
   {
    body: 'I was a complete beginner, and now I feel confident enough to start my own freelance business. The step-by-step tutorials are amazing.',
    author: {
      name: 'Anjali Singh',
      handle: 'Aspiring Makeup Artist',
      imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
  },
   {
    body: 'The best investment I have made in my professional development. The courses are practical, relevant, and very engaging. Highly recommended!',
    author: {
      name: 'Rahul Kumar',
      handle: 'Salon Owner, Delhi',
      imageUrl: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
  },
];

export default function TestimonialsSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-pink-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Our students love what we do
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                <div className="flex-grow">
                  <p className="text-base text-gray-700">{testimonial.body}</p>
                </div>
                <footer className="mt-8">
                  <div className="flex items-center gap-x-4">
                    <img className="h-12 w-12 rounded-full bg-gray-100" src={testimonial.author.imageUrl} alt="" />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                      <div className="text-gray-600">@{testimonial.author.handle}</div>
                    </div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 