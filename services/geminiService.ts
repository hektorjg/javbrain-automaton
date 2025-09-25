// Get the webhook URL from environment variables
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK;

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

// Function to generate game code via webhook
export const generateGameCode = async (
  gameName: string,
  onStatusUpdate: (status: string) => void
): Promise<string> => {
  if (!WEBHOOK_URL) {
    throw new Error("Webhook URL not configured. Please set VITE_N8N_WEBHOOK in your environment variables.");
  }

  try {
    onStatusUpdate('GENERATING_CODE');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameName: gameName,
        prompt: getPrompt(gameName)
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    
    // Check if the response contains an error
    if (jsonResponse && jsonResponse.error) {
      throw new Error(`Webhook error: ${jsonResponse.error}`);
    }
    
    // Extract the game code from the "text" field of the JSON response
    if (!jsonResponse || typeof jsonResponse.text !== 'string') {
      throw new Error("Invalid webhook response: missing or invalid 'text' field");
    }

    const gameCode = jsonResponse.text.trim();
    
    if (!gameCode) {
      throw new Error("Webhook returned empty game code");
    }

    return gameCode;

  } catch (error) {
    console.error("Error generating game code via webhook:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate game via webhook. Please try again.");
  }
};