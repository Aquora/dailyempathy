/**
 * Prisma seed script.
 * Run with: npx prisma db seed
 *
 * Canvas institutions: to add a school, set these env vars and run the seed:
 *   CANVAS_BASE_URL     - e.g. https://canvas.school.edu
 *   CANVAS_CLIENT_ID    - from the school's Canvas Developer Key
 *   CANVAS_CLIENT_SECRET
 *   CANVAS_INSTITUTION_NAME - e.g. "My University"
 * The school's Canvas admin must create a Developer Key and add your app's
 * redirect URI (e.g. https://your-app.vercel.app/api/canvas/callback).
 */

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const baseUrl = process.env.CANVAS_BASE_URL;
  const clientId = process.env.CANVAS_CLIENT_ID;
  const clientSecret = process.env.CANVAS_CLIENT_SECRET;
  const name =
    process.env.CANVAS_INSTITUTION_NAME || "Canvas (from env)";

  if (baseUrl && clientId && clientSecret) {
    await prisma.canvasInstitution.upsert({
      where: { baseUrl: baseUrl.replace(/\/$/, "") },
      create: {
        baseUrl: baseUrl.replace(/\/$/, ""),
        name,
        clientId,
        clientSecret,
      },
      update: {
        name,
        clientId,
        clientSecret,
      },
    });
    console.log("Canvas institution upserted:", name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
