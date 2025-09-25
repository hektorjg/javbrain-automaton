import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getPrompt = (gameName: string) => `
You are an expert retro game developer. Your task is to generate the complete, self-contained code for a classic retro game based on the user's request.

**Requirements:**
1.  **Single HTML File:** The entire output MUST be a single, valid HTML file.
2.  **Self-Contained:** All CSS and JavaScript code must be embedded directly within the HTML file using \`<style>\` and \`<script>\` tags.
3.  **No External Dependencies:** Do NOT use any external libraries, frameworks (like React, Vue, jQuery), or external assets (images, fonts). Use only vanilla JavaScript, HTML5 Canvas, and CSS.
4.  **Playable and Functional:** The game must be fully playable from the generated code. Include game logic, controls (keyboard), and a win/lose condition if applicable.
5.  **Retro Aesthetic:** Style the game to have a retro, pixelated aesthetic. Use a dark background (like #000 or #111) and bright, neon-like colors for game elements.
6.  **Layout:** The game canvas should be centered on the page, and the body should have no margin.
7.  **Instructions:** Include simple on-screen instructions for how to play the game (e.g., "Use Arrow Keys to move").

**User's Game Request:** "${gameName}"

Generate the complete HTML code for the "${gameName}" game now. Your response should contain only the HTML code and nothing else.
`;

export const generateGameCode = async (
  gameName: string,
  onStatusUpdate: (status: string) => void
): Promise<string> => {
  const prompt = getPrompt(gameName);

  try {
    onStatusUpdate('GENERATING_CODE');
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let completeCode = "";
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        completeCode += chunkText;
      }
    }
    
    if (!completeCode.trim()) {
      throw new Error("AI returned an empty response.");
    }

    return completeCode;

  } catch (error) {
    console.error("Error generating game code:", error);
    throw new Error("Failed to generate game. The AI mainframe might be busy. Please try again.");
  }
};