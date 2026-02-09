import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user has Google Calendar connected
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { googleRefreshToken: true },
  });

  const googleConnected = !!user?.googleRefreshToken;

  return <DashboardClient googleConnected={googleConnected} />;
}
