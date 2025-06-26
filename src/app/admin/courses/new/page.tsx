"use client";

import React from "react";
import CourseForm from "@/components/CourseForm";

export default function NewCoursePage() {
  return (
    <main className="min-h-[60vh] p-8">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <CourseForm />
    </main>
  );
} 