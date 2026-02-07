// Gemini AI service for CarePilot
export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GeminiResponse {
  content: string;
  latencyMs: number;
}

class GeminiService {
  private config: GeminiConfig;

  constructor() {
    this.config = {
      apiKey: process.env.GOOGLE_AI_API_KEY || "",
      model: "gemini-2.0-flash-exp",
    };
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<GeminiResponse> {
    if (!this.config.apiKey) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
    }

    const start = Date.now();

    try {
      // Combine system and user prompt
      const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\nUser: ${prompt}`
        : prompt;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - start;

      const content =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return {
        content,
        latencyMs,
      };
    } catch (error) {
      const latencyMs = Date.now() - start;
      throw new Error(`Gemini generation failed: ${String(error)}`);
    }
  }
}

export const geminiService = new GeminiService();
