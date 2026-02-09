"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full border border-white/10 py-2.5 font-mono text-sm tracking-widest text-white/60 transition-colors hover:border-red-500/30 hover:text-red-400"
    >
      SIGN OUT
    </button>
  );
}
