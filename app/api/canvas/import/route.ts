import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { refreshCanvasToken, canvasFetch } from "@/lib/canvas";

const PER_PAGE = 50;
const DAYS_AHEAD = 90;

type CanvasCourse = { id: number; name?: string };
type CanvasAssignment = {
  id: number;
  name: string;
  due_at: string | null;
  course_id: number;
  created_at?: string;
};

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      canvasInstitutionId: true,
      canvasAccessToken: true,
      canvasRefreshToken: true,
      canvasTokenExpiry: true,
      canvasInstitution: true,
    },
  });

  if (
    !user?.canvasInstitutionId ||
    !user?.canvasAccessToken ||
    !user?.canvasInstitution
  ) {
    return NextResponse.json(
      { error: "Canvas not connected" },
      { status: 400 }
    );
  }

  let accessToken = user.canvasAccessToken;
  const baseUrl = user.canvasInstitution.baseUrl.replace(/\/$/, "");
  const { clientId, clientSecret } = user.canvasInstitution;

  if (
    user.canvasTokenExpiry &&
    new Date() >= new Date(user.canvasTokenExpiry.getTime() - 60 * 1000)
  ) {
    if (!user.canvasRefreshToken) {
      return NextResponse.json(
        { error: "Canvas token expired. Please reconnect." },
        { status: 401 }
      );
    }
    try {
      const refreshed = await refreshCanvasToken(
        baseUrl,
        clientId,
        clientSecret,
        user.canvasRefreshToken
      );
      accessToken = refreshed.access_token;
      const expiry = new Date(Date.now() + refreshed.expires_in * 1000);
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          canvasAccessToken: accessToken,
          canvasTokenExpiry: expiry,
        },
      });
    } catch (err) {
      console.error("Canvas token refresh failed:", err);
      return NextResponse.json(
        { error: "Failed to refresh Canvas token. Please reconnect." },
        { status: 401 }
      );
    }
  }

  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + DAYS_AHEAD);

  try {
    const courses: CanvasCourse[] = [];
    let courseUrl: string | null = `${baseUrl}/api/v1/courses?per_page=${PER_PAGE}&enrollment_state=active`;
    while (courseUrl) {
      const { data, nextPage } = await canvasFetch<CanvasCourse>(
        courseUrl,
        accessToken
      );
      courses.push(...data);
      courseUrl = nextPage;
    }

    const courseNames: Record<number, string> = {};
    for (const c of courses) {
      courseNames[c.id] = c.name ?? "School";
    }

    let imported = 0;

    for (const course of courses) {
      let assignUrl: string | null = `${baseUrl}/api/v1/courses/${course.id}/assignments?per_page=${PER_PAGE}`;
      while (assignUrl) {
        const { data: assignments, nextPage } =
          await canvasFetch<CanvasAssignment>(assignUrl, accessToken);

        for (const a of assignments) {
          if (!a.due_at) continue;
          const due = new Date(a.due_at);
          if (due < now || due > cutoff) continue;

          const existing = await prisma.calendarEvent.findFirst({
            where: {
              userId: session.user.id,
              canvasId: String(a.id),
            },
          });

          const category = courseNames[a.course_id] ?? "School";
          const startDate = a.created_at ? new Date(a.created_at) : due;

          if (existing) {
            await prisma.calendarEvent.update({
              where: { id: existing.id },
              data: {
                title: a.name,
                category,
                startDate,
                endDate: due,
              },
            });
          } else {
            await prisma.calendarEvent.create({
              data: {
                title: a.name,
                category,
                status: "planned",
                startDate,
                endDate: due,
                source: "canvas",
                canvasId: String(a.id),
                userId: session.user.id,
              },
            });
            imported++;
          }
        }

        assignUrl = nextPage;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      courses: courses.length,
    });
  } catch (err) {
    console.error("Canvas import error:", err);
    return NextResponse.json(
      { error: "Failed to import Canvas assignments" },
      { status: 500 }
    );
  }
}
