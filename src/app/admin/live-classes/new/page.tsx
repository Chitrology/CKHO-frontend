"use client";
import React from "react";
import LiveClassForm from '../../../../components/LiveClassForm';

export default function NewLiveClassPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Live Class</h1>
      <LiveClassForm mode="create" />
    </main>
  );
} 