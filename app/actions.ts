'use server';

import { GoogleGenAI } from "@google/genai";

export async function analyzeResume(jd: string, pdfBase64: string, filename: string) {
  // 🔥 Define modelName outside 'try'
  const modelName = "gemini-2.0-flash"; 

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in .env.local file");
    }

    const client = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
      Act as a strict ATS Resume Scanner. Analyze the Resume against the Job Description (JD).
      
      CRITICAL RULES:
      1. Be numeric and objective.
      2. DO NOT hallucinate skills not present in the resume.
      3. OUTPUT ONLY the report. No conversational filler ("Here is the report", "I hope this helps").
      4. Date format: DD-MM-YYYY.

      INPUTS:
      JD: "${jd.slice(0, 3000)}"
      RESUME FILE: "${filename}"

      OUTPUT FORMAT (Markdown):
      
      ## 1. Match Score: [0-100]%
      **Reason:** [One concise sentence justifying the score]

      ## 2. Missing Keywords 🚫
      * [Keyword 1]
      * [Keyword 2]
      * [Keyword 3]

      ## 3. Skills Analysis
      | Skill Required | Status | Evidence in Resume |
      | :--- | :--- | :--- |
      | [Skill Name] | ✅ / ⚠️ / ❌ | [Brief proof or "Missing"] |

      ## 4. Experience Match
      * **Required:** [JD Requirement]
      * **Candidate:** [Resume Experience]
      * **Verdict:** [Match/Partial/No Match]

      ## 5. Final Verdict
      **Status:** [Strong Match / Moderate Match / Weak Match]
      **Summary:** [One final closing sentence]
    `;

    const response = await client.models.generateContent({
      model: modelName,
      config: {
        temperature: 0.0, // Strictness Level: Max
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
    
    if (error.message.includes("404")) return `Error: Model '${modelName}' not found. Check API Key permissions.`;
    if (error.message.includes("429")) return "Error: Server busy (Rate Limit). Please wait 10s.";
    
    return `Error: ${error.message}`;
  }
}