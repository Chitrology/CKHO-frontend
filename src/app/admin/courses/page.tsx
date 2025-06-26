"use client";

import React, { useEffect, useState } from "react";
import axiosInstance, { getErrorMessage } from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  status: string;
  level: string;
  price: number;
};

type CourseTableProps = {
  courses: Course[];
  onDelete: (course: Course) => void;
  onPublish: (course: Course) => void;
};

function CourseTable({ courses, onDelete, onPublish }: CourseTableProps) {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Level</th>
          <th className="p-2 text-left">Price</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id} className="border-b">
            <td className="p-2">
              <Link href={`/admin/courses/${course.id}`} className="text-pink-600 hover:underline">
                {course.title}
              </Link>
            </td>
            <td className="p-2">{course.status}</td>
            <td className="p-2">{course.level}</td>
            <td className="p-2">₹{course.price}</td>
            <td className="p-2 flex gap-2">
              <Link href={`/admin/courses/${course.id}`} className="px-2 py-1 bg-blue-500 text-white rounded">
                Edit
              </Link>
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => onDelete(course)}>Delete</button>
              {course.status !== "PUBLISHED" && (
                <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => onPublish(course)}>Publish</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, course }: { open: boolean; onClose: () => void; onConfirm: () => void; course: Course | null }) {
  if (!open || !course) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h3 className="text-lg font-bold mb-2">Delete Course</h3>
        <p>Are you sure you want to delete <span className="font-semibold">{course.title}</span>?</p>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function PublishFeedbackModal({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h3 className="text-lg font-bold mb-2">Publish Course</h3>
        <p>{message}</p>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-pink-600 text-white rounded" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [publishMsg, setPublishMsg] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/api/courses?limit=50");
        setCourses(res.data.courses || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [refresh]);

  async function handleDeleteConfirm() {
    if (!courseToDelete) return;
    try {
      await axiosInstance.delete(`/api/courses/${courseToDelete.id}`);
      setRefresh((r) => r + 1);
      setCourseToDelete(null);
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  }

  async function handlePublish(course: Course) {
    try {
      const res = await axiosInstance.post(`/api/courses/${course.id}/publish`);
      if (res.data.status === 'PUBLISHED') {
        setPublishMsg("Course published successfully!");
      } else {
        setPublishMsg(getErrorMessage(res.data));
      }
      setShowPublish(true);
      setRefresh((r) => r + 1);
    } catch (err: any) {
      setPublishMsg(getErrorMessage(err));
      setShowPublish(true);
    }
  }

  function closePublishModal() {
    setShowPublish(false);
    setPublishMsg("");
  }

  return (
    <main className="min-h-[60vh] p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Link href="/admin/courses/new">
          <button className="px-4 py-2 bg-pink-600 text-white rounded">+ New Course</button>
        </Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CourseTable courses={courses} onDelete={setCourseToDelete} onPublish={handlePublish} />
      )}
      <ConfirmDeleteModal
        open={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        course={courseToDelete}
      />
      <PublishFeedbackModal open={showPublish} onClose={closePublishModal} message={publishMsg} />
    </main>
  );
} 