"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import ParticleWave from "@/app/components/ParticleWave";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-mono text-xs tracking-widest text-white/40"
        >
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-gold/50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-mono text-xs tracking-widest text-white/40"
        >
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-gold/50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-gold py-3 font-mono text-sm tracking-widest text-gold transition-all hover:bg-gold hover:text-black disabled:opacity-50"
        style={{
          clipPath:
            "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
        }}
      >
        {loading ? "SIGNING IN..." : "[SIGN IN]"}
      </button>

      <p className="text-center text-sm text-white/30">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-gold transition-colors hover:text-gold-dim"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <ParticleWave />

      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-20 font-mono text-sm tracking-widest text-white/40 transition-colors hover:text-white"
      >
        &larr; HOME
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 font-mono text-xs text-white/40">
            Sign in to your DailyEmpathy account
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/2 p-8 backdrop-blur-sm">
          <Suspense
            fallback={
              <div className="text-center text-sm text-white/40">
                Loading...
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
