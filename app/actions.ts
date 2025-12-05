'use server';

import { GoogleGenAI } from "@google/genai";

export async function analyzeResume(jd: string, pdfBase64: string, filename: string) {
  // 🔥 FIX: Define modelName outside 'try' so 'catch' block can access it
  const modelName = "gemini-2.0-flash";

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if key exists
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in .env.local file");
    }

    const client = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
      You are an expert Hiring Manager with 35yrs experience.

      
      Job Description: "${jd.slice(0, 3000)}"
      Resume File Name: "${filename}"
      
      Analyze the resume against the JD and provide:
      1. Match Score (%).
      2. Missing Keywords.
      3. Specific Changes.
      4. Recommended Filename.
      5. Final Verdict.
    `;
    const response = await client.models.generateContent({
      model: modelName,
      // 🔥 CRITICAL FIX: Temperature 0.0 makes it deterministic (Same Input = Same Output)
      config: {
        temperature: 0.0,
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }
          ]
        }
      ]
    });

    const candidate = response.candidates?.[0];
    const textOutput = response.text || candidate?.content?.parts?.[0]?.text;

    if (textOutput) {
      return textOutput;
    }

    return "Error: No text generated.";

  } catch (error: any) {
    console.error("AI Error:", error);

    // Error Handling
    if (error.message.includes("404")) return `Error: Model '${modelName}' not found. Check API Key permissions.`;
    if (error.message.includes("429")) return "Error: Server busy (Rate Limit). Please wait 10s.";

    return `Error: ${error.message}`;
  }
}