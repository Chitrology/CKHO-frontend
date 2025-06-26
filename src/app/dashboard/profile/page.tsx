"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosWithAuth from "@/utils/axios";
import KYCForm from "./KYCForm";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ProfileForm() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if(user) {
      setValue("fullName", user.fullName || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);
  
  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosWithAuth.put(`${API_URL}/api/users/me`, { fullName: data.fullName });
      setSuccess("Profile updated successfully.");
      reset({ fullName: res.data.user.fullName });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">My details</h3>
        <p className="text-sm text-gray-500">Update your profile information.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
           {error && <div className="mb-2 text-red-500 text-sm text-center">{error}</div>}
           {success && <div className="mb-2 text-green-600 text-sm text-center">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              disabled
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-75"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  const [tab, setTab] = useState<'profile' | 'kyc'>('profile');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab === 'profile' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setTab('profile')}
          >
            My details
          </button>
          <button
             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab === 'kyc' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setTab('kyc')}
          >
            KYC
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {tab === 'profile' && <ProfileForm />}
        {tab === 'kyc' && <KYCForm />}
      </div>
    </div>
  );
} 