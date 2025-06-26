"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabaseClient";

const CONTENT_BUCKET = "course-content";

export type ContentFormData = {
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ" | "ASSIGNMENT";
  order: number;
  url?: string;
  videoFile?: FileList;
};

type ContentFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ContentFormData>) => void | Promise<void>;
  initialData?: Partial<ContentFormData>;
  moduleId: string;
};

export default function ContentForm({ open, onClose, onSubmit, initialData, moduleId }: ContentFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<ContentFormData>({
    defaultValues: initialData || { title: "", type: "VIDEO", order: 1, url: "" },
  });

  const [uploading, setUploading] = useState(false);
  const type = watch("type");

  useEffect(() => {
    if (open) {
      reset(initialData || { title: "", type: "VIDEO", order: 1, url: "" });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ContentFormData) => {
    setUploading(true);
    let fileUrl = data.url;

    // If type is VIDEO and a file is selected, upload it
    if (data.type === "VIDEO" && data.videoFile && data.videoFile.length > 0) {
      const file = data.videoFile[0];
      const filePath = `${moduleId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(CONTENT_BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        alert("Error uploading video: " + uploadError.message);
        setUploading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;
    }

    const payload = {
      title: data.title,
      type: data.type,
      order: data.order,
      url: fileUrl,
    };

    await onSubmit(payload);
    setUploading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow w-full max-w-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <h3 className="text-lg font-bold mb-2">{initialData ? "Edit Content" : "Add Content"}</h3>
        <label className="block mb-2">
          Title
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border p-2 rounded mt-1"
            required
          />
          {errors.title && <div className="text-red-600 text-xs mt-1">{errors.title.message}</div>}
        </label>
        <label className="block mb-2">
          Type
          <select
            {...register("type", { required: true })}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </label>
        <label className="block mb-2">
          Order
          <input
            type="number"
            {...register("order", { required: true, valueAsNumber: true, min: 1 })}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>
        {type === "VIDEO" && (
          <label className="block mb-2">
            Upload Video
            <input
              type="file"
              accept="video/*"
              {...register("videoFile", { required: !initialData?.url })}
              className="w-full border p-2 rounded mt-1"
            />
            {initialData?.url && <div className="text-xs text-gray-500 mt-1">Current video: <a href={initialData.url} target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Link</a>. Upload a new video to replace it.</div>}
            {errors.videoFile && <div className="text-red-600 text-xs mt-1">{errors.videoFile.message}</div>}
          </label>
        )}
        {type === "DOCUMENT" && (
          <label className="block mb-2">
            Document URL
            <input
              {...register("url", { required: "Document URL is required" })}
              className="w-full border p-2 rounded mt-1"
              required
            />
            {errors.url && <div className="text-red-600 text-xs mt-1">{errors.url.message}</div>}
          </label>
        )}
        {(type === "QUIZ" || type === "ASSIGNMENT") && (
          <div className="mb-2 text-xs text-gray-500">Quiz/Assignment details can be managed after creation.</div>
        )}
        <div className="flex gap-2 mt-4">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} disabled={isSubmitting || uploading}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded" disabled={isSubmitting || uploading}>{uploading ? "Uploading..." : isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
} 