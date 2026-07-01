import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@purebook/db";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteId = (session.user as any).siteId;
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date"); // YYYY-MM-DD

  const date = dateParam ? new Date(dateParam) : new Date();
  date.setHours(0, 0, 0, 0);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const [specialists, appointments] = await Promise.all([
    prisma.specialist.findMany({
      where: { siteId, status: "Active" },
      include: {
        availability: true,
      },
      orderBy: { firstName: "asc" },
    }),
    prisma.appointment.findMany({
      where: {
        siteId,
        appointmentDate: { gte: date, lt: nextDay },
        isDeleted: false,
      },
      include: {
        customer: true,
        services: {
          include: {
            service: true,
            specialist: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({ specialists, appointments, date: date.toISOString() });
}
