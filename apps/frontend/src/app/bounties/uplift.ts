"use server";

import { GoogleGenAI, Type } from "@google/genai";

// Initialize the SDK (it automatically picks up process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({});

export interface BountyData {
  title: string;
  description: string;
  amount: string;
  unit: string;
  endDate: string;
}

export async function upliftBounty(bounty: BountyData) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `You are a bounty quality analyst for a Web3/tech bounty platform. Analyse the following bounty and rate its quality.

    Title: ${bounty.title}
    Description: ${bounty.description}
    Reward: ${bounty.amount} ${bounty.unit}
    End Date: ${bounty.endDate}
    
    Score based on: clarity of scope (25 pts), reward competitiveness vs market (25 pts), description quality (25 pts), deadline reasonableness (25 pts). Keep each remark under 10 words.`,
    config: {
      // Force the model to return a valid JSON string
      responseMimeType: "application/json",
      // Enforce the exact structure your frontend expects
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "Quality score from 0 to 100",
          },
          verdict: {
            type: Type.STRING,
            enum: ["EXCELLENT", "GOOD", "FAIR", "POOR"],
            description: "Overall verdict",
          },
          remarks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of brief improvement suggestions",
          },
        },
        required: ["score", "verdict", "remarks"],
      },
    },
  });

  // response.text is now guaranteed to be a JSON string matching your schema
  if (!response.text) {
    throw new Error("No response returned from Gemini");
  }

  // Parse it into a JavaScript object before sending it to the client
  return JSON.parse(response.text);
}