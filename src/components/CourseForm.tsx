"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance, { getErrorMessage } from "@/utils/axios";
import { useRouter } from "next/navigation";

// This type is for the form's internal state, using strings for inputs
export type CourseFormData = {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  priceBuy: number;
  priceRent: number;
  duration: number;
  tags: string;
  prerequisites: string;
};

// This type represents the data from the API (and what we pass as initialData)
type CourseApiData = Omit<CourseFormData, "tags" | "prerequisites"> & {
  tags: string[];
  prerequisites: string[];
};

type CourseFormProps = {
  initialData?: Partial<CourseApiData>; // Expects string arrays
  courseId?: string;
};

export default function CourseForm({ initialData, courseId }: CourseFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          tags: initialData.tags?.join(", ") || "",
          prerequisites: initialData.prerequisites?.join(", ") || "",
        }
      : {},
  });

  const onSubmit: SubmitHandler<CourseFormData> = async (data) => {
    try {
      // Only include allowed fields
      const payload = {
        title: data.title,
        description: data.description,
        level: data.level,
        status: data.status,
        priceBuy: data.priceBuy,
        priceRent: data.priceRent,
        duration: data.duration,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        prerequisites: data.prerequisites.split(",").map(t => t.trim()).filter(Boolean),
      };
      console.log('Course PATCH payload:', payload);

      if (courseId) {
        // Update existing course
        await axiosInstance.patch(`/api/courses/${courseId}`, payload);
        alert("Course updated successfully!");
      } else {
        // Create new course
        const res = await axiosInstance.post("/api/courses", payload);
        alert("Course created successfully!");
        router.push(`/admin/courses/${res.data.id}`); // Redirect to edit page
      }
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
          <select
            id="level"
            {...register("level", { required: "Level is required" })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={4}
            {...register("description", { required: "Description is required" })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Buy Price */}
        <div>
          <label htmlFor="priceBuy" className="block text-sm font-medium text-gray-700">Buy Price (₹)</label>
          <input
            id="priceBuy"
            type="number"
            {...register("priceBuy", { required: true, valueAsNumber: true, min: 0 })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Rent Price */}
        <div>
          <label htmlFor="priceRent" className="block text-sm font-medium text-gray-700">Rent Price (₹)</label>
          <input
            id="priceRent"
            type="number"
            {...register("priceRent", { required: true, valueAsNumber: true, min: 0 })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            {...register("duration", { required: true, valueAsNumber: true, min: 1 })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {/* Status */}
        <div>
           <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
           <select 
             id="status"
            {...register("status")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
           >
             <option value="DRAFT">Draft</option>
             <option value="PUBLISHED">Published</option>
             <option value="ARCHIVED">Archived</option>
           </select>
         </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            id="tags"
            {...register("tags")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Prerequisites */}
        <div className="md:col-span-2">
          <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">Prerequisites (comma-separated)</label>
          <input
            id="prerequisites"
            {...register("prerequisites")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : courseId ? "Save Changes" : "Create Course"}
        </button>
      </div>
    </form>
  );
} 