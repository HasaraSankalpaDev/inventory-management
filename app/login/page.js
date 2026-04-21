"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      // Fetch session to get user role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/cashier/pos"); // Cashier default page
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 antialiased font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-200/50"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Grocery Shop
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-lg focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-all duration-200 placeholder:text-slate-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-lg focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-all duration-200 placeholder:text-slate-400"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4988C4] text-white font-medium py-3 rounded-lg hover:bg-[#3a75ad] hover:shadow-lg hover:shadow-[#4988C4]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-offset-2 focus:ring-offset-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}
