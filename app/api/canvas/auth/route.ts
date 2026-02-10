import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const institutionId = request.nextUrl.searchParams.get("institutionId");
  if (!institutionId) {
    return NextResponse.json(
      { error: "institutionId is required" },
      { status: 400 }
    );
  }

  const institution = await prisma.canvasInstitution.findUnique({
    where: { id: institutionId },
  });

  if (!institution) {
    return NextResponse.json(
      { error: "Institution not found" },
      { status: 404 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/canvas/callback`;
  const state = `${session.user.id}:${institutionId}`;

  const baseUrl = institution.baseUrl.replace(/\/$/, "");
  const authUrl = new URL(`${baseUrl}/login/oauth2/auth`);
  authUrl.searchParams.set("client_id", institution.clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
