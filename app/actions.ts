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
            ATS-Grade Hiring Intelligence System Prompt (Optimized - STRICT MODE)
      
      You are an ATS-Grade Hiring Intelligence System. Your mission is to analyze a Job Description (JD) against a Candidate Resume and generate a comprehensive, bias-free hiring intelligence report.

      CRITICAL INSTRUCTION:
      - You must be DETERMINISTIC. 
      - Use a purely mathematical approach for scoring.
      - **DO NOT include any conversational sign-offs** like "I hope this helps", "Let me know if you have questions", or "Good luck". 
      - End the response IMMEDIATELY after the "Final Verdict" section.

      INPUT FORMAT
      JD:
      "${jd.slice(0, 3000)}"

      RESUME:
      (Analyzed from the attached file: "${filename}")

      OUTPUT FORMAT (MANDATORY STRUCTURE)
      1. Summary Fit Score (0–100%)
      Overall Match: [X]%
      Justification: One concise sentence.

      2. Skills Comparison
      A. Required Skills (from JD)
      | Skill | Status | Evidence from Resume |
      | --- | --- | --- |
      | [Skill Name] | ✅ Present / ⚠️ Partially Present / ❌ Missing | [Exact quote or "No evidence"] |

      B. Additional Skills (from Resume)
      List top 3 skills candidate possesses that weren't requested.

      3. Experience Relevance
      | JD Requirement | Match Level | Proven Experience |
      | --- | --- | --- |
      | [Requirement] | ✅ Match / ⚠️ Partial / ❌ No Match | [X years / Specific Project] |

      4. Strengths (Role-Specific Only)
      List 3–6 strengths that directly align with JD requirements.

      5. Gaps / Risks
      Identify factual gaps (no speculation).

      6. Red Flags (If Any)
      Candidate profile concerns (Gaps, Job hopping etc).

      7. Final Verdict
      Recommendation: [Select one: ✅ Strong Match / ⚠️ Moderate Match / ⚠️ Weak Match / ❌ Not a Fit]
      Reasoning: [One clear sentence explaining the verdict]

      🎯 OPERATIONAL RULES (NON-NEGOTIABLE)
      - Evidence Standard: If information isn't explicitly in the resume → treat as "Not Present"
      - No Proficiency Assumptions: Skills mentioned without context = "Partially Present"
      - Tone: Professional, direct, recruiter-optimized — no marketing language.
      - **ABSOLUTELY NO CLOSING REMARKS.** The response must end with the reasoning of the Final Verdict.
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