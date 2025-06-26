"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function AuthForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { register: registerAuth, handleSubmit: handleAuthSubmit, reset: resetAuth } = useForm();
  const { register: registerForgot, handleSubmit: handleForgotSubmit, reset: resetForgot } = useForm();

  const handleAuth = async (data: any) => {
    setAuthError(null);
    setIsLoading(true);
    setVerificationSent(false);

    if (isSignUp) {
      try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password, fullName: data.fullName }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Registration failed');
        setVerificationSent(true);
      } catch (error: any) {
        setAuthError(error.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) setAuthError(error.message);
    }
    
    setIsLoading(false);
    resetAuth();
  };

  const handleForgotPassword = async (data: any) => {
    setAuthError(null);
    setIsLoading(true);
    setForgotSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email);
    if (error) {
      setAuthError(error.message);
    } else {
      setForgotSent(true);
    }
    setIsLoading(false);
    resetForgot();
  };
  
  const AuthInput = ({ name, type, placeholder, register, required }: any) => (
    <div>
      <label htmlFor={name} className="sr-only">{placeholder}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm"
        disabled={isLoading}
      />
    </div>
  );

  if (showForgot) {
    return (
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter your email and we'll send you a link to get back into your account.
            </p>
          </div>
          <div className="mt-10">
            {forgotSent ? (
              <div className="text-center text-green-600">
                If an account with that email exists, a password reset link has been sent.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit(handleForgotPassword)} className="space-y-6">
                <AuthInput name="email" type="email" placeholder="Email address" register={registerForgot} required />
                {authError && <p className="text-red-500 text-sm">{authError}</p>}
                <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-75">
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}
             <p className="mt-10 text-center text-sm text-gray-500">
              Remembered your password?{' '}
              <button onClick={() => setShowForgot(false)} className="font-semibold leading-6 text-pink-600 hover:text-pink-500">
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isSignUp ? "Already a member? " : "Not a member? "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-pink-600 hover:text-pink-500">
              {isSignUp ? "Sign in" : "Register now"}
            </button>
          </p>
        </div>
        <div className="mt-10">
          {verificationSent ? (
            <div className="text-center text-green-600">
              A verification email has been sent. Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit(handleAuth)} className="space-y-6">
              {isSignUp && <AuthInput name="fullName" type="text" placeholder="Full Name" register={registerAuth} required />}
              <AuthInput name="email" type="email" placeholder="Email address" register={registerAuth} required />
              <AuthInput name="password" type="password" placeholder="Password" register={registerAuth} required />
              
              {!isSignUp && (
                 <div className="flex items-center justify-end">
                  <div className="text-sm leading-6">
                    <button onClick={() => setShowForgot(true)} className="font-semibold text-pink-600 hover:text-pink-500">
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}
              
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              
              <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-75">
                {isLoading ? "Processing..." : (isSignUp ? "Create account" : "Sign in")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="space-x-4">
             <Link href="/dashboard" className="inline-flex items-center rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
              <button onClick={signOut} className="font-semibold text-pink-600 hover:text-pink-500">
                Sign Out
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AuthForm />
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop"
          alt=""
        />
      </div>
    </div>
  );
} 