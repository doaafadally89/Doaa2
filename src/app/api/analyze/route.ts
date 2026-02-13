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

const DEMO_REPORT = `# ShipCheck QA Report

## Visual Consistency

- **Severity**: **Minor**
- **Category**: Visual Consistency
- **Issue**: Inconsistent border radius between cards and buttons — cards use 12px while action buttons use 8px.
- **Location**: Main content area, CTA section
- **Recommendation**: Standardize border-radius to a single design token (e.g., 12px for containers, 8px for interactive elements).

## Typography

- **Severity**: **Major**
- **Category**: Typography
- **Issue**: Body text line-height is too tight at 1.2, making paragraphs harder to read. WCAG recommends at least 1.5 for body text.
- **Location**: All paragraph text across the page
- **Recommendation**: Increase line-height to 1.5 or 1.6 for body copy.

- **Severity**: **Suggestion**
- **Category**: Typography
- **Issue**: Consider using font-weight 600 instead of 700 for subheadings to create a smoother visual hierarchy.
- **Location**: Section subheadings
- **Recommendation**: Adjust subheading font-weight to 600 (semi-bold).

## Color & Contrast

- **Severity**: **Critical**
- **Category**: Color & Contrast
- **Issue**: Light gray placeholder text (#B0B0B0) on white background has a contrast ratio of only 2.6:1, well below the WCAG AA minimum of 4.5:1.
- **Location**: Input fields (email, password)
- **Recommendation**: Darken placeholder text to at least #767676 (4.5:1 ratio) or use a subtle background tint.

## Spacing & Layout

- **Severity**: **Minor**
- **Category**: Spacing & Layout
- **Issue**: Uneven vertical spacing between sections — 32px gap above feature cards but 24px gap below them.
- **Location**: Features section
- **Recommendation**: Use consistent 32px vertical rhythm between all major sections.

## Accessibility

- **Severity**: **Major**
- **Category**: Accessibility
- **Issue**: Interactive icons lack accessible labels. Screen readers will skip or misidentify these controls.
- **Location**: Navigation icons, action buttons with only icons
- **Recommendation**: Add aria-label attributes to all icon-only buttons (e.g., aria-label="Close menu").

- **Severity**: **Suggestion**
- **Category**: Accessibility
- **Issue**: Focus ring is not visible on keyboard navigation. Tab-users cannot tell which element is active.
- **Location**: All interactive elements
- **Recommendation**: Add a visible focus-visible outline (e.g., 2px solid primary color with 2px offset).

## Interactive States

- **Severity**: **Minor**
- **Category**: Interactive States
- **Issue**: Primary CTA button has no visible pressed/active state — no scale or color change on click.
- **Location**: "Get Started" and "Run QA Scan" buttons
- **Recommendation**: Add active:scale-[0.98] and a slightly darker background on press.

## Edge Cases

- **Severity**: **Suggestion**
- **Category**: Edge Cases
- **Issue**: Long email addresses in the header will overflow on screens below 375px width.
- **Location**: Header user info area
- **Recommendation**: Add text truncation (truncate class) with a max-width on the email display.

---

## Summary Score: **72 / 100**

The design is clean and modern with good overall structure. The critical contrast issue on input placeholders should be fixed before shipping. Addressing the accessibility gaps (icon labels, focus rings) and typography line-height will significantly improve the user experience across all devices and abilities.

---

*This is a demo report. Connect your OpenAI API key for real AI-powered analysis of your screenshots.*`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Demo mode: return a sample report when OpenAI key is not configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ report: DEMO_REPORT });
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
