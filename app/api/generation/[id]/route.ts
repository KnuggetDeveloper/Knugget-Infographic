import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 16
    const { id } = await params;

    const generation = await prisma.generation.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // Check if the user owns this generation
    if (generation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view this generation" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: generation.id,
      prompt: generation.prompt,
      imageData: generation.imageData,
      createdAt: generation.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching generation:", error);
    return NextResponse.json(
      { error: "Failed to fetch generation" },
      { status: 500 }
    );
  }
}
