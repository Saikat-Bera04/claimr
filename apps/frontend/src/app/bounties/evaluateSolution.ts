// src/app/bounties/evaluateSolution.ts
"use server";

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

export async function evaluateProof(
  bounty: { title: string; description: string },
  proof: string
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `You are an expert technical evaluator for a Web3 bounty platform. 
      Evaluate the following submission against the bounty requirements.
      
      Bounty Title: ${bounty.title}
      Bounty Description: ${bounty.description}
      Hunter's Proof (Link/Explanation): ${proof}
      
      Analyze how well this proof satisfies the requirements. Provide a score out of 100, and a short remark (under 15 words) explaining the score. If the proof is just a random link or nonsense, score it low.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Score from 0 to 100" },
            remarks: { type: Type.STRING, description: "Brief justification under 15 words" },
          },
          required: ["score", "remarks"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response returned from Gemini");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    throw new Error(
      error?.status === 429 || error?.message?.includes("Quota")
        ? "RATE_LIMIT_EXCEEDED"
        : "EVALUATION_FAILED"
    );
  }
}