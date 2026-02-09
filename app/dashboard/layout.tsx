import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "./components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar userName={session.user.name} userEmail={session.user.email} />
      <main className="pt-16">{children}</main>
    </div>
  );
}
