import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.calendarEvent.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.category && { category: body.category }),
        ...(body.status && { status: body.status }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.calendarEvent.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.calendarEvent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
