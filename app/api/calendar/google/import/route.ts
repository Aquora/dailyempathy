import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  });

  if (!user?.googleRefreshToken) {
    return NextResponse.json(
      { error: "Google Calendar not connected" },
      { status: 400 }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google Calendar is not configured" },
      { status: 500 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry?.getTime(),
  });

  // Refresh token if expired
  if (user.googleTokenExpiry && new Date() >= user.googleTokenExpiry) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          googleAccessToken: credentials.access_token || null,
          googleTokenExpiry: credentials.expiry_date
            ? new Date(credentials.expiry_date)
            : null,
        },
      });
      oauth2Client.setCredentials(credentials);
    } catch (err) {
      console.error("Token refresh failed:", err);
      return NextResponse.json(
        { error: "Failed to refresh Google token. Please reconnect." },
        { status: 401 }
      );
    }
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Fetch events from the next 3 months
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: threeMonthsLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const googleEvents = response.data.items || [];
    let imported = 0;

    for (const gEvent of googleEvents) {
      if (!gEvent.id || !gEvent.summary) continue;

      const startDate = gEvent.start?.dateTime || gEvent.start?.date;
      const endDate = gEvent.end?.dateTime || gEvent.end?.date;

      if (!startDate || !endDate) continue;

      // Upsert: update if googleId exists, otherwise create
      const existing = await prisma.calendarEvent.findFirst({
        where: {
          googleId: gEvent.id,
          userId: session.user.id,
        },
      });

      if (existing) {
        await prisma.calendarEvent.update({
          where: { id: existing.id },
          data: {
            title: gEvent.summary,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        });
      } else {
        await prisma.calendarEvent.create({
          data: {
            title: gEvent.summary,
            category: "Google",
            status: "planned",
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            source: "google",
            googleId: gEvent.id,
            userId: session.user.id,
          },
        });
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      total: googleEvents.length,
    });
  } catch (err) {
    console.error("Google Calendar import error:", err);
    return NextResponse.json(
      { error: "Failed to import Google Calendar events" },
      { status: 500 }
    );
  }
}
