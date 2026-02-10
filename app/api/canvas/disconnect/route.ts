import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        canvasInstitutionId: null,
        canvasAccessToken: null,
        canvasRefreshToken: null,
        canvasTokenExpiry: null,
      },
    });

    await prisma.calendarEvent.deleteMany({
      where: {
        userId: session.user.id,
        source: "canvas",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Canvas disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
