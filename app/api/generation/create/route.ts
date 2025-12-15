import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to generate infographics." },
        { status: 401 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Create generation record with placeholder
    const generation = await prisma.generation.create({
      data: {
        prompt,
        imageData: "", // Empty initially, will be filled during generation
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
    });
  } catch (error) {
    console.error("Error creating generation:", error);
    return NextResponse.json(
      { error: "Failed to create generation" },
      { status: 500 }
    );
  }
}

