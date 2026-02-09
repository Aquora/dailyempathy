import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  let where: Record<string, unknown> = { userId: session.user.id };

  if (month && year) {
    const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where = {
      ...where,
      OR: [
        {
          startDate: { gte: startOfMonth, lte: endOfMonth },
        },
        {
          endDate: { gte: startOfMonth, lte: endOfMonth },
        },
      ],
    };
  }

  const events = await prisma.calendarEvent.findMany({
    where,
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, endDate, status, startDate } = body;

    if (!title || !category || !endDate) {
      return NextResponse.json(
        { error: "Title, category, and end date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        category,
        status: status || "planned",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
