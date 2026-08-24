import { CountryHealthData } from "@/lib/types";
import Groq from "groq-sdk";

export interface AiSummaryResponse {
  success: boolean;
  summary?: string[];
  model?: string;
  error?: string;
  code?: string;
}

export async function generateExecutiveSummary(healthData: CountryHealthData): Promise<AiSummaryResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not set. Skipping AI summary.");
    return {
      success: false,
      error: "Groq API key not configured",
      code: "MISSING_API_KEY"
    };
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const prompt = `You are an economic intelligence analyst.

Analyze only the structured economic data provided by the application.

Do not invent statistics.
Do not introduce external facts.
Do not change numerical values.
Do not calculate new metrics.
Do not claim correlation implies causation.

Return exactly 3 concise executive-summary bullets.

Bullet 1: Overall economic condition.
Bullet 2: Most important positive or negative driver.
Bullet 3: Most important trend, risk, or opportunity.

Use professional language suitable for an economic intelligence dashboard.

Data:
Economy Health Score: ${healthData.overallScore}/100 (${healthData.status})
Category Scores:
${healthData.categoryScores.map(c => `${c.categorySlug}: ${c.score}/100`).join("\n")}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    // Split by newlines, clean up bullet points if AI included them, filter out empty lines
    const bullets = content
      .split("\n")
      .map((line: string) => line.replace(/^[-•*0-9.]*\s*/, "").trim())
      .filter((line: string) => line.length > 0);

    return {
      success: true,
      summary: bullets.slice(0, 3),
      model
    };
  } catch (error: any) {
    console.error("Failed to generate AI summary:", error);
    
    // Log additional details if available from Groq SDK
    if (error instanceof Groq.APIError) {
      console.error(`HTTP Status: ${error.status}`);
      console.error(`Error body:`, error.error);
    }
    
    return {
      success: false,
      error: "Groq request failed",
      code: "GROQ_REQUEST_FAILED"
    };
  }
}
