"use client";

import { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80";

const LoginPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email")?.toString().trim() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };
    // TODO: hand off to authentication service
    console.log("login payload", payload);
  };

  const handleGoogleSignIn = () => {
    // TODO: trigger Google OAuth flow
    console.log("login with Google");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white via-[#FFF5EB] to-white px-4 py-10 text-gray-900">
      <div className="grid w-full max-w-5xl gap-10 rounded-3xl border border-[#F2D8C3] bg-white p-6 shadow-xl md:grid-cols-2 md:p-10">
        <div className="relative hidden overflow-hidden rounded-2xl md:block">
          <Image
            src={LOGIN_IMAGE}
            alt="Community members collaborating on energy planning"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/40" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/85 p-4 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FC7019]">
              IslaGrid Network
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Securely access dashboards that track generation, distribution,
              and shared profits for every community project.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#FC7019]"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#FC7019]">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Sign in to your IslaGrid account
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Continue overseeing your barangay’s renewable energy proposal and
              wallet distributions.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@barangay.ph"
                className="mt-2 w-full rounded-xl border border-[#F2D8C3] bg-white px-4 py-3 text-sm text-gray-900 shadow-inner focus:border-[#FC7019] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-[#F2D8C3] bg-white px-4 py-3 text-sm text-gray-900 shadow-inner focus:border-[#FC7019] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#FC7019] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E8620F]"
            >
              Sign in
            </button>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#F2D8C3] bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#FC7019] hover:text-[#FC7019]"
              >
                <FcGoogle className="h-5 w-5" aria-hidden="true" />
                Sign in with Google
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#FC7019] hover:text-[#D85505]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
