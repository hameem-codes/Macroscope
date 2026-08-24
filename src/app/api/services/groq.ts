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
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

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
${healthData.categoryScores.map(c => `${c.categorySlug}: ${c.score}/100${c.change ? ` (Change: ${c.change})` : ''}`).join("\n")}
Top Improving Indicators: ${healthData.historicalScores ? 'Available' : 'N/A'}
Top Deteriorating Indicators: ${healthData.historicalScores ? 'Available' : 'N/A'}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    // Split by newlines, filter out empty lines, and clean up standard list markers
    // (e.g. "1. ", "- ", "• ") without breaking markdown bolding like "**Heading:**"
    const bullets = content
      .split("\n")
      .map((line: string) => {
        let clean = line.trim();
        // Remove leading numbered lists like "1. ", "02. ", "1) "
        clean = clean.replace(/^[0-9]+[.)]\s+/, "");
        // Remove leading bullets like "- ", "• ", "* " (but NOT "**")
        clean = clean.replace(/^[-•]\s+/, "");
        if (clean.startsWith("* ") && !clean.startsWith("**")) {
          clean = clean.substring(2);
        }
        return clean;
      })
      .filter((line: string) => line.length > 0);

    return {
      success: true,
      summary: bullets,
      model
    };
  } catch (error: any) {
    console.error("Failed to generate AI summary with model:", model);
    
    // Log additional details if available from Groq SDK
    if (error instanceof Groq.APIError) {
      console.error(`HTTP Status: ${error.status}`);
      console.error(`Error body:`, error.error);
    } else {
      console.error(error);
    }
    
    return {
      success: false,
      error: "Groq request failed",
      code: "GROQ_REQUEST_FAILED"
    };
  }
}
