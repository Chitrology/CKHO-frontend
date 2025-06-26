"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export type ModuleFormData = {
  title: string;
  description: string;
  order: number;
};

type ModuleFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => void | Promise<void>;
  initialData?: Partial<ModuleFormData>;
};

export default function ModuleForm({ open, onClose, onSubmit, initialData }: ModuleFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ModuleFormData>({
    defaultValues: initialData || { title: "", description: "", order: 1 },
  });

  useEffect(() => {
    if (open) {
      reset(initialData || { title: "", description: "", order: 1 });
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow w-full max-w-md"
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
        })}
      >
        <h3 className="text-lg font-bold mb-2">{initialData ? "Edit Module" : "Add Module"}</h3>
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
          Description
          <textarea
            {...register("description", { required: "Description is required" })}
            className="w-full border p-2 rounded mt-1"
            required
          />
          {errors.description && <div className="text-red-600 text-xs mt-1">{errors.description.message}</div>}
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
        <div className="flex gap-2 mt-4">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded" disabled={isSubmitting}>{isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
} 