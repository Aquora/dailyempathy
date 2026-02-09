"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface ProfileDropdownProps {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
}

export default function ProfileDropdown({
  userName,
  userEmail,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = (userName?.[0] || userEmail?.[0] || "U").toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-sm text-gold transition-colors hover:border-gold/30"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#111] p-4 shadow-2xl">
          <div className="mb-3 border-b border-white/5 pb-3">
            <p className="text-sm font-medium text-white">
              {userName || "User"}
            </p>
            <p className="mt-0.5 font-mono text-xs text-white/40">
              {userEmail}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full rounded-lg px-3 py-2 text-left font-mono text-xs tracking-widest text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}
