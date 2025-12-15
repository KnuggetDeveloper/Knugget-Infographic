import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the generation exists and belongs to the user
    const generation = await prisma.generation.findUnique({
      where: { id },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    if (generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if already generated
    if (generation.imageData && generation.imageData !== "") {
      return NextResponse.json({
        success: true,
        imageData: generation.imageData,
        cached: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // System prompt for infographic generation
    const systemPrompt = `You are an expert infographic designer. Create a vibrant, professional infographic that visualizes the user's request. The infographic should be:
- Visually appealing with clear data visualization
- Well-organized with proper sections and labels
- Professional and suitable for sharing on social media
- Include relevant charts, graphs, or visual elements
- Use a modern, clean design style
- Ensure all text is legible and well-placed`;

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${generation.prompt}\n\nGenerate a high-quality infographic based on the above request.`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: fullPrompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    // Extract image data from response
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;

          // Update generation with image data
          await prisma.generation.update({
            where: { id },
            data: { imageData },
          });

          return NextResponse.json({
            success: true,
            imageData: imageData,
          });
        }
      }
    }

    return NextResponse.json(
      { error: "No image generated in response" },
      { status: 500 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: errorMessage || "Failed to generate image" },
      { status: 500 }
    );
  }
}

