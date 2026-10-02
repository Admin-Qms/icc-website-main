const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const { MEMORY_DIR } = require("../agents/shared/config");

const IMAGES_DIR = path.join(MEMORY_DIR, "images");
const MIN_IMAGE_SIZE = 50 * 1024; // 50KB — reject broken/empty output

async function generateFeaturedImage(prompt, filename) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "GEMINI_API_KEY not set", isQuotaError: false };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["Image"],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");

        if (buffer.length < MIN_IMAGE_SIZE) {
          return { success: false, error: `Image too small (${Math.round(buffer.length / 1024)}KB < 50KB)`, isQuotaError: false };
        }

        fs.mkdirSync(IMAGES_DIR, { recursive: true });
        const outputPath = path.join(IMAGES_DIR, filename);
        fs.writeFileSync(outputPath, buffer);
        return { success: true, path: outputPath, filename, sizeKB: Math.round(buffer.length / 1024) };
      }
    }

    throw new Error("No image returned in response");
  } catch (error) {
    const msg = error.message || "";
    const isQuota =
      error.status === 429 ||
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("rate limit");

    return { success: false, error: msg, isQuotaError: isQuota };
  }
}

module.exports = { generateFeaturedImage, IMAGES_DIR, MIN_IMAGE_SIZE };
