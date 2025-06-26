"use client";
import React, { useEffect, useState } from "react";
import axiosWithAuth, { purchaseCourse, getPurchaseStatus, startRental, getErrorMessage } from "@/utils/axios";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { CheckCircle, PlayCircle, Lock, Tag, BarChart, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Content {
  id: string;
  title: string;
  type: string;
  url?: string;
  duration?: number;
  order: number;
}
interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  contents: Content[];
}
interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  priceBuy?: number;
  priceRent?: number;
  status: string;
  tags?: string[];
  modules: Module[];
  thumbnail?: string;
}

type PurchaseStatus = {
  type: 'BUY' | 'RENT';
  status: string;
  rentalStart: string | null;
  rentalEnd: string | null;
  canAccess: boolean;
  expiry: string | null;
};

function formatCountdown(target: string | null) {
  if (!target) return null;
  const now = new Date();
  const end = new Date(target);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

interface CourseCurriculumProps {
  modules: Module[];
  canAccess: boolean;
}

function CourseCurriculum({ modules, canAccess }: CourseCurriculumProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Course content</h2>
      <div className="mt-6">
        <Accordion selectionMode="multiple" defaultExpandedKeys={["0"]}>
          {modules.sort((a,b) => a.order - b.order).map((module, index) => (
            <AccordionItem key={index} aria-label={module.title} title={<span className="font-semibold">{module.title}</span>} subtitle={module.description}>
              <ul className="space-y-4 py-2">
                {module.contents.sort((a,b) => a.order - b.order).map((content: any) => (
                  <li key={content.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {canAccess ? (
                        <PlayCircle className="h-5 w-5 text-pink-600 mr-3" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <span className={`${canAccess ? 'text-gray-800' : 'text-gray-500'}`}>{content.title}</span>
                    </div>
                     <span className="text-sm text-gray-500">{content.duration ? `${content.duration}m` : ''}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

interface PurchaseSidebarProps {
  course: Course;
  purchaseStatus: PurchaseStatus | null;
  handlePurchase: (type: 'BUY' | 'RENT') => void;
  handleStartRental: () => void;
  purchaseLoading: boolean;
  countdown: string | null;
}

function PurchaseSidebar({ course, purchaseStatus, handlePurchase, handleStartRental, purchaseLoading, countdown }: PurchaseSidebarProps) {
  const canAccess = purchaseStatus?.canAccess || false;

  return (
    <div className="w-full lg:w-96 lg:flex-shrink-0">
      <div className="lg:sticky lg:top-24 bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={course.thumbnail || '/placeholder-image.svg'}
          alt={`Thumbnail for ${course.title}`}
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="p-6">
          {purchaseStatus ? (
            <div>
              {purchaseStatus.type === 'BUY' && (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold">You own this course</p>
                  <p className="text-sm">You have lifetime access.</p>
                </div>
              )}
              {purchaseStatus.type === 'RENT' && (
                 <div>
                  {purchaseStatus.rentalStart && purchaseStatus.canAccess ? (
                    <div className="text-center p-4 bg-blue-50 text-blue-700 rounded-lg">
                      <p className="font-semibold">Rental active</p>
                      <p className="text-sm">Expires in: {countdown || '...'}</p>
                    </div>
                  ) : purchaseStatus.status === 'EXPIRED' ? (
                     <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-semibold">Rental Expired</p>
                      </div>
                  ) : (
                    <button onClick={handleStartRental} disabled={purchaseLoading} className="w-full flex justify-center rounded-md bg-pink-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-75">
                      {purchaseLoading ? 'Starting...' : 'Start 48-Hour Rental'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-gray-900">₹{course.priceBuy ?? course.price}</span>
              </div>
              <button onClick={() => handlePurchase('BUY')} disabled={purchaseLoading} className="w-full flex justify-center rounded-md bg-pink-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-75">
                {purchaseLoading ? 'Processing...' : 'Buy Now'}
              </button>
              {course.priceRent && course.priceRent > 0 && (
                <button onClick={() => handlePurchase('RENT')} disabled={purchaseLoading} className="w-full flex justify-center rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-75">
                   {purchaseLoading ? 'Processing...' : `Rent for ₹${course.priceRent}`}
                </button>
              )}
            </div>
          )}

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900">This course includes:</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><Clock className="h-5 w-5 text-gray-400 mr-3"/>{course.modules?.reduce((acc, m) => acc + m.contents.length, 0) * 5} hours on-demand video (approx)</li>
                <li className="flex items-center"><BarChart className="h-5 w-5 text-gray-400 mr-3"/>{course.level} Level</li>
                <li className="flex items-center"><Tag className="h-5 w-5 text-gray-400 mr-3"/>Full lifetime access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailsPage({ params }: { params: { id:string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);
  const router = useRouter();

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosWithAuth.get(`/api/courses/${params.id}`);
        setCourse(res.data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.id]);

  // Fetch purchase status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await getPurchaseStatus(params.id);
        setPurchaseStatus(res.data);
      } catch {
        setPurchaseStatus(null);
      }
    }
    fetchStatus();
  }, [params.id, purchaseMsg]);

  // Countdown for expiry
  useEffect(() => {
    if (!purchaseStatus || !purchaseStatus.expiry) return;
    const interval = setInterval(() => {
      setCountdown(formatCountdown(purchaseStatus.expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, [purchaseStatus]);

  async function handlePurchase(type: 'BUY' | 'RENT') {
    setPurchaseLoading(true);
    setPurchaseMsg(null);
    try {
      await purchaseCourse(params.id, type);
      setPurchaseMsg(type === 'BUY' ? 'Course purchased! Lifetime access granted.' : 'Course rented! Start your rental within 30 days.');
    } catch (err: any) {
      setPurchaseMsg(getErrorMessage(err));
    } finally {
      setPurchaseLoading(false);
    }
  }

  async function handleStartRental() {
    setPurchaseLoading(true);
    setPurchaseMsg(null);
    try {
      await startRental(params.id);
      setPurchaseMsg('Rental started! You have 48 hours to watch.');
    } catch (err: any) {
      setPurchaseMsg(getErrorMessage(err));
    } finally {
      setPurchaseLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!course) return <div className="flex justify-center items-center h-screen">Course not found.</div>;

  const canAccess = purchaseStatus?.canAccess || false;

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row-reverse lg:gap-x-12">
          
          <PurchaseSidebar 
            course={course} 
            purchaseStatus={purchaseStatus} 
            handlePurchase={handlePurchase} 
            handleStartRental={handleStartRental}
            purchaseLoading={purchaseLoading}
            countdown={countdown}
          />
          
          <div className="w-full lg:max-w-3xl">
            {/* Course Header */}
            <div className="lg:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{course.title}</h1>
              <p className="mt-6 text-xl leading-8 text-gray-600">{course.description}</p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Level: {course.level}</span>
              </div>
               {(course.tags?.length ?? 0) > 0 && (
                <div className="flex items-center gap-x-2">
                  {course.tags?.map(tag => <span key={tag} className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700">{tag}</span>)}
                </div>
              )}
            </div>

            <CourseCurriculum modules={course.modules} canAccess={canAccess} />

             {purchaseMsg && <div className="mt-8 text-center text-green-600 p-4 bg-green-50 rounded-lg">{purchaseMsg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
} 