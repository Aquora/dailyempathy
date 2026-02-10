import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/dashboard?error=canvas_denied", request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid_callback", request.url)
    );
  }

  const [userId, institutionId] = state.split(":");
  if (userId !== session.user.id || !institutionId) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid_callback", request.url)
    );
  }

  const institution = await prisma.canvasInstitution.findUnique({
    where: { id: institutionId },
  });

  if (!institution) {
    return NextResponse.redirect(
      new URL("/dashboard?error=institution_not_found", request.url)
    );
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/canvas/callback`;

  const baseUrl = institution.baseUrl.replace(/\/$/, "");
  const tokenUrl = `${baseUrl}/login/oauth2/token`;

  try {
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: institution.clientId,
        client_secret: institution.clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Canvas token exchange failed:", tokenRes.status, text);
      return NextResponse.redirect(
        new URL("/dashboard?error=token_exchange_failed", request.url)
      );
    }

    const tokens = (await tokenRes.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };

    const expiresIn = tokens.expires_in ?? 3600;
    const expiry = new Date(Date.now() + expiresIn * 1000);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        canvasInstitutionId: institutionId,
        canvasAccessToken: tokens.access_token ?? null,
        canvasRefreshToken: tokens.refresh_token ?? null,
        canvasTokenExpiry: expiry,
      },
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("Canvas OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/dashboard?error=token_exchange_failed", request.url)
    );
  }
}
