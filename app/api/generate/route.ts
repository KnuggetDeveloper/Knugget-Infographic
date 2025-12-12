import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
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

    // Combine system prompt with user prompt
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}\n\nGenerate a high-quality infographic based on the above request.`;

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
