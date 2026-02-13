import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are ShipCheck, an expert Design QA analyst with 12+ years of experience catching UI bugs.
You receive a screenshot of a mobile app or web interface and produce a detailed QA report.

Analyze the design across these categories:
1. **Visual Consistency** — Alignment, spacing uniformity, element sizing
2. **Typography** — Font hierarchy, readability, line heights, truncation issues
3. **Color & Contrast** — WCAG contrast ratios, color consistency, dark/light mode
4. **Spacing & Layout** — Padding, margins, grid alignment, responsive concerns
5. **Accessibility** — Touch targets, alt text indicators, focus states, screen reader hints
6. **Interactive States** — Buttons, hover/press states, loading indicators, empty states
7. **Edge Cases** — Long text, RTL readiness, data overflow, error states

For each issue found, provide:
- **Severity**: Critical / Major / Minor / Suggestion
- **Category**: One of the categories above
- **Issue**: Clear description of what's wrong
- **Location**: Where on the screen (e.g., "top navigation bar", "card #2")
- **Recommendation**: How to fix it

End with a **Summary Score** out of 100 and a 1-2 sentence overall assessment.

Format the report in clean Markdown.`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please perform a comprehensive Design QA review of this screen. Identify every visual bug, accessibility issue, and design inconsistency you can find.",
            },
            {
              type: "image_url",
              image_url: { url: image, detail: "high" },
            },
          ],
        },
      ],
    });

    const report = response.choices[0]?.message?.content || "No analysis generated.";

    return NextResponse.json({ report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
