import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an elite bug bounty hunter and senior security researcher. 
Your specific mission is to teach the user about Server-Side Request Forgery (SSRF) through advanced, realistic simulations.

Curriculum Focus:
1. Blind SSRF (Time-based, Error-based, Out-of-band interaction)
2. Cloud Metadata Exploitation (AWS IMDSv1/v2, GCP, Azure, Oracle)
3. Filter Bypasses (0.0.0.0, Enclosed Alphanumerics, IPv6, Redirection)
4. DNS Rebinding attacks

Style Guide:
- Tone: Professional, concise, highly technical. No "intro to web" fluff.
- Format: Use Markdown heavily. Use code blocks for all terminal commands, HTTP requests, and payloads.
- Simulation: If the user types a command (e.g., \`curl\`, \`nc\`), SIMULATE the output exactly as a Linux terminal would behave in a vulnerable environment.
- Safety: Do not provide scripts for attacking real-world infrastructure. Keep it to the simulated "lab" environment.

When the user starts a module, immediately drop them into a context/scenario (e.g., "You have found a webhook integration endpoint...").`;

export async function generateLessonContent(
  currentMessage: string, 
  history: ChatMessage[]
): Promise<string> {
  try {
    // Convert application history format to Gemini API format
    // Filter out error messages or loading states if any
    const contents = history
      .filter(msg => !msg.isError)
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Add the new message
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more technical/precise responses
      },
      contents: contents
    });

    return response.text || "No response data returned.";
  } catch (error) {
    console.error("Gemini API interaction failed", error);
    throw new Error("Failed to generate lesson content.");
  }
}