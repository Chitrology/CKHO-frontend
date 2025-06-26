"use client";
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const faqs = [
  {
    question: "What is CKHO and what do you offer?",
    answer:
      "CKHO is an online learning platform dedicated to professional makeup and beauty education. We offer a wide range of expert-led video courses, hands-on projects, and a supportive community to help you master your craft.",
    category: 'General',
  },
  {
    question: "Who are the courses for?",
    answer:
      "Our courses are designed for everyone, from absolute beginners looking to start their journey to seasoned professionals wanting to update their skills with the latest techniques and trends.",
    category: 'Courses',
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes, upon successful completion of any course, you will receive a digital certificate from CKHO that you can share on your professional networks and portfolio.",
    category: 'Courses',
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, and other popular online payment methods. All transactions are secure and encrypted.",
    category: 'Payments',
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "We offer a 7-day money-back guarantee. If you're not satisfied with a course, you can request a full refund within 7 days of purchase, no questions asked.",
    category: 'Payments',
  },
   {
    question: "How do I get support if I'm stuck?",
    answer:
      "You'll have access to our community forums where you can ask questions and get help from mentors and fellow students. For technical issues, our support team is available via the contact page.",
    category: 'General',
  },
];

const faqCategories = ['General', 'Courses', 'Payments'];

export default function FAQPage() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-4xl font-bold leading-10 tracking-tight text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqCategories.map((category) => (
              <div key={category} className="pt-8">
                <h3 className="text-xl font-semibold leading-7 text-pink-600">{category}</h3>
                <div className="mt-4">
                  {faqs.filter(faq => faq.category === category).map((faq) => (
                    <Disclosure as="div" key={faq.question} className="pt-6">
                      {({ open }) => (
                        <>
                          <dt>
                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                              <span className="text-base font-semibold leading-7">{faq.question}</span>
                              <span className="ml-6 flex h-7 items-center">
                                <ChevronUpIcon
                                  className={`${
                                    open ? 'rotate-180 transform' : ''
                                  } h-6 w-6 text-gray-400 transition-transform`}
                                />
                              </span>
                            </Disclosure.Button>
                          </dt>
                          <Disclosure.Panel as="dd" className="mt-2 pr-12">
                            <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 