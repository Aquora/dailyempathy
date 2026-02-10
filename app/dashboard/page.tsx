import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      googleRefreshToken: true,
      canvasInstitutionId: true,
      canvasAccessToken: true,
    },
  });

  const googleConnected = !!user?.googleRefreshToken;
  const canvasConnected =
    !!user?.canvasInstitutionId && !!user?.canvasAccessToken;

  return (
    <DashboardClient
      googleConnected={googleConnected}
      canvasConnected={canvasConnected}
    />
  );
}
