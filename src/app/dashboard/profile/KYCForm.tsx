"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosWithAuth, { getErrorMessage } from "@/utils/axios";
import { supabase } from "@/utils/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const KYC_BUCKET = "kyc-docs";

export default function KYCForm() {
  const [status, setStatus] = useState<string>("loading");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    const fetchKycStatus = async () => {
      setLoading(true);
      try {
        const res = await axiosWithAuth.get(`${API_URL}/api/kyc/status`);
        setStatus(res.data.status);
        setFeedback(res.data.feedback);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchKycStatus();
  }, []);

  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Upload files to Supabase Storage
      let aadharUrl = "";
      let panUrl = "";
      const userId = supabase.auth.getUser().then(({ data: { user } }) => user?.id);
      // Aadhar upload
      const aadharFile = data.aadharFile?.[0];
      if (!aadharFile) throw new Error("Aadhar document is required");
      const aadharPath = `aadhar/${Date.now()}_${aadharFile.name}`;
      const { data: aadharUpload, error: aadharError } = await supabase.storage
        .from(KYC_BUCKET)
        .upload(aadharPath, aadharFile);
      if (aadharError) throw new Error(aadharError.message);
      aadharUrl = supabase.storage.from(KYC_BUCKET).getPublicUrl(aadharPath).data.publicUrl;
      // PAN upload (optional)
      const panFile = data.panFile?.[0];
      if (panFile) {
        const panPath = `pan/${Date.now()}_${panFile.name}`;
        const { data: panUpload, error: panError } = await supabase.storage
          .from(KYC_BUCKET)
          .upload(panPath, panFile);
        if (panError) throw new Error(panError.message);
        panUrl = supabase.storage.from(KYC_BUCKET).getPublicUrl(panPath).data.publicUrl;
      }
      // Submit KYC
      await axiosWithAuth.post(`${API_URL}/api/kyc/submit`, {
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber,
        kycDocs: {
          aadhar_url: aadharUrl,
          pan_url: panUrl,
        },
      });
      setSuccess("KYC submitted successfully.");
      setStatus("pending");
      reset();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-center">KYC Submission</h3>
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="mb-2 text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="mb-2 text-green-600 text-sm text-center">{success}</div>}
      {!loading && (
        <>
          <div className="mb-4 text-center">
            <span className="font-medium">Status:</span>{" "}
            <span className={
              status === "approved"
                ? "text-green-600"
                : status === "pending"
                ? "text-yellow-600"
                : status === "rejected"
                ? "text-red-600"
                : "text-gray-600"
            }>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {feedback && (
            <div className="mb-4 text-center text-sm text-red-500">
              <span className="font-medium">Admin Feedback:</span> {feedback}
            </div>
          )}
          {status === "pending" ? (
            <div className="text-center text-yellow-600">You have a pending KYC submission. Please wait for review.</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Aadhar Number"
                {...register("aadharNumber", { required: true })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="PAN Number (optional)"
                {...register("panNumber")}
                className="w-full px-3 py-2 border rounded"
              />
              <div>
                <label className="block mb-1 font-medium">Aadhar Document (PDF/JPG/PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("aadharFile", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">PAN Document (PDF/JPG/PNG, optional)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("panFile")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                disabled={loading}
              >
                Submit KYC
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
} 