"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarProps {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b border-white/10 bg-[#0a0a0a]/80 px-8 backdrop-blur-sm">
      {/* Left: Brand */}
      <div className="flex w-1/3 items-center">
        <Link href="/dashboard" className="font-serif text-xl text-gold">
          DailyEmpathy
        </Link>
      </div>

      {/* Center: Dashboard nav link */}
      <div className="flex w-1/3 items-center justify-center">
        <Link
          href="/dashboard"
          className={`font-mono text-xs tracking-widest transition-colors ${
            pathname === "/dashboard"
              ? "text-gold border-b-2 border-gold pb-0.5"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          DASHBOARD
        </Link>
      </div>

      {/* Right: Profile */}
      <div className="flex w-1/3 items-center justify-end">
        <ProfileDropdown userName={userName} userEmail={userEmail} />
      </div>
    </nav>
  );
}
