import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let institutions = await prisma.canvasInstitution.findMany({
      select: { id: true, name: true, baseUrl: true },
      orderBy: { name: "asc" },
    });

    // If no institutions in DB but env is set, create one so user doesn't need to run the seed
    if (institutions.length === 0) {
      const baseUrl = process.env.CANVAS_BASE_URL;
      const clientId = process.env.CANVAS_CLIENT_ID;
      const clientSecret = process.env.CANVAS_CLIENT_SECRET;
      const name =
        process.env.CANVAS_INSTITUTION_NAME || "Canvas (from env)";

      if (baseUrl && clientId && clientSecret) {
        const created = await prisma.canvasInstitution.upsert({
          where: { baseUrl: baseUrl.replace(/\/$/, "") },
          create: {
            baseUrl: baseUrl.replace(/\/$/, ""),
            name,
            clientId,
            clientSecret,
          },
          update: { name, clientId, clientSecret },
        });
        institutions = [
          {
            id: created.id,
            name: created.name,
            baseUrl: created.baseUrl,
          },
        ];
      }
    }

    return NextResponse.json(institutions);
  } catch (err) {
    console.error("Canvas institutions list error:", err);
    return NextResponse.json(
      { error: "Failed to load institutions" },
      { status: 500 }
    );
  }
}
