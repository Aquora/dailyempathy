import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/2 p-8 backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="font-serif text-2xl">
            Welcome, {session.user.name || "there"}!
          </h1>
          <p className="mt-1 font-mono text-xs text-white/40">
            {session.user.email}
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-gold/10 p-4">
          <p className="font-mono text-sm text-gold">
            Successfully authenticated
          </p>
          <p className="mt-1 text-xs text-white/40">
            Your dashboard will be built here — calendar, todo list, and your
            motivational companion.
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
