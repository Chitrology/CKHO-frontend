import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-white px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 border border-gray-100">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              Ready to start your journey?
              <br />
              Join CKHO today.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
             Sign up now and get immediate access to our entire library of courses. Your future in beauty starts here.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                href="/auth?mode=signup"
                className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link href="/courses" className="text-sm font-semibold leading-6 text-pink-600">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8 flex items-center justify-center">
            <img
              className="w-[28rem] max-w-full rounded-md bg-white/5 ring-1 ring-gray-100"
              src="/placeholder-image.svg"
              alt="App screenshot"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 