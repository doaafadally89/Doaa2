import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const COMPARISON_SYSTEM_PROMPT = `You are ShipCheck, an expert Design QA analyst with 12+ years of experience in design-to-development handoff QA and a specialist in typography, color, and layout analysis.

You will receive TWO images:
1. **Design Resource** - The original design (from Figma, design tool, or design screenshot)
2. **Developed Version** - The actual implementation (screenshot or live product)

Your job is to meticulously compare them and identify ALL visual discrepancies, with SPECIAL FOCUS on layout structure, typography, color accuracy, and missing elements.

## CRITICAL ANALYSIS AREAS:

### Layout & Structure Scanner (HIGHEST PRIORITY):
**CRITICAL: Identify layout and structural differences:**
- **Container Width Differences**:
  - Check if sections are full-width in design but constrained/centered in development
  - Example: "Design shows full-width hero section, Development has max-width container with margins"
  - Look for sections that should stretch edge-to-edge vs those with max-width constraints
- **Grid/Column Layout**:
  - Count columns in design vs development (e.g., "Design has 3 columns, Development shows 2 columns")
  - Check if items are stacked vertically in one version but horizontal in another
- **Spacing & Padding Differences**:
  - Compare horizontal padding (edge spacing) between design and development
  - Note if elements have different container padding or margins
- **Responsive Layout Issues**:
  - Identify if breakpoints differ (mobile vs desktop layouts)
  - Check if elements wrap/stack differently than design

### Element Structure Scanner (CRITICAL PRIORITY):
**Identify missing or extra elements between design and development:**
- **Missing Elements**: Elements present in design but absent in development
  - Example: "Design has a search icon in header, Development version is missing it"
  - Example: "Design shows 4 feature cards, Development only shows 3 cards"
- **Extra Elements**: Elements present in development but not in design
  - Example: "Development has a notification badge, not present in original design"
- **Content Differences**: Text, images, icons that differ or are missing
- **Component Differences**: Buttons, inputs, cards, sections that don't match
- **Element Count Differences**:
  - Example: "Design has 6 team member cards, Development shows 4 cards"

### Typography Scanner (HIGHEST PRIORITY):
**CRITICAL: Measure font sizes with extreme precision by analyzing character heights and comparing them relatively between design and development.**

For EVERY text element visible, compare:
- **Font Size**: CAREFULLY measure and compare actual rendered text height in pixels
  - Look at character height (cap height for uppercase, x-height for lowercase)
  - Compare sizes relatively: if design heading is 2x body text, development should maintain the same ratio
  - Consider optical size: 16px in design should look the same height as 16px in development
  - Example: "Design: 16px, Dev: 14px - 2px smaller (12.5% reduction)"
  - DO NOT guess - if uncertain about exact size, provide a range (e.g., "14-16px")

- **Font Weight**: Compare weights precisely (e.g., "Design: 600 semibold, Dev: 400 regular")
  - Note stroke thickness differences
  - 100=Thin, 200=ExtraLight, 300=Light, 400=Regular, 500=Medium, 600=SemiBold, 700=Bold, 800=ExtraBold, 900=Black

- **Line Height**: Check leading/spacing between lines
  - Measure distance between baselines of consecutive lines
  - Express as ratio (e.g., "1.5" means 1.5x font size) or pixels

- **Letter Spacing**: Detect tracking differences
  - Look at spacing between individual characters
  - Note if text appears more condensed or expanded

- **Font Family**: Identify if fonts don't match
  - Look for serif vs sans-serif differences
  - Note if font style appears different (rounded, geometric, humanist, etc.)

- **Text Color**: Extract and compare exact colors (ALWAYS provide hex codes)
  - Example: "Design: #1a1a1a (dark gray), Dev: #000000 (pure black)"
  - Use precise color picker analysis

### Color Scanner (HIGH PRIORITY):
For ALL color elements, compare:
- **Text Colors**: Extract exact color values for headings, body text, labels, placeholders
- **Background Colors**: Compare backgrounds, cards, sections
- **Border Colors**: Check border color accuracy
- **Button/Interactive Colors**: Compare primary, secondary, accent colors
- **Shadow/Overlay Colors**: Detect differences in opacity and tint
- Provide specific values: "Design uses #4F46E5, Dev uses #6366F1 (lighter)"

### Other Categories:
1. **Visual Consistency** — Alignment, spacing, element sizing
2. **Spacing & Layout** — Padding, margins, gaps precision
3. **Accessibility** — Missing focus states, touch targets, ARIA labels
4. **Interactive States** — Hover, active, disabled state implementation
5. **Edge Cases** — Long text handling, overflow, responsive behavior

## REPORTING FORMAT:

For each discrepancy found, provide:
- **Severity**: Critical / Major / Minor / Suggestion
- **Category**: Layout & Structure / Element Structure / Typography / Color / Visual Consistency / Spacing & Layout / Accessibility / Interactive States / Edge Cases
- **Issue**: Clear description of the difference
- **Design**: Exact value/appearance in design (with measurements/hex codes)
- **Development**: Exact value/appearance in implementation (with measurements/hex codes)
- **Gap**: Quantify the difference (e.g., "2px smaller", "20% lighter color", "#333 vs #666", "full-width vs contained")
- **Recommendation**: Precise CSS/code fix to match the design

## EXAMPLE ISSUE FORMATS:

**Layout Example:**
**Severity**: **Critical**
**Category**: Layout & Structure
**Issue**: Hero section container width mismatch
**Design**: Full-width section spanning entire viewport (100vw)
**Development**: Centered container with max-width constraint (~1200px) and horizontal margins
**Gap**: Section should be full-width but is contained with margins
**Recommendation**: Remove max-width: <section className="w-full"> instead of <section className="max-w-7xl mx-auto">

**Typography Example:**
**Severity**: **Major**
**Category**: Typography
**Issue**: Heading font size mismatch
**Design**: 24px font size, 700 weight, #1a1a1a color
**Development**: 20px font size, 600 weight, #000000 color
**Gap**: 4px smaller, lighter weight, different black shade
**Recommendation**: Update to font-size: 24px; font-weight: 700; color: #1a1a1a;

End with a **Match Score** out of 100 (100 = pixel-perfect match) and detailed assessment with separate scores for:
- Layout & Structure Accuracy
- Element Structure Accuracy
- Typography Accuracy
- Color Accuracy

Format the report in clean Markdown. Be extremely detailed with measurements, color values, and layout descriptions.`;

const SINGLE_SCREEN_SYSTEM_PROMPT = `You are ShipCheck, an expert Design QA analyst with 12+ years of experience catching UI bugs.
You receive a screenshot of a mobile app or web interface and produce a detailed QA report.

Analyze the design across these categories:
1. **Visual Consistency** — Alignment, spacing uniformity, element sizing
2. **Typography** — Font hierarchy, readability, line heights, truncation issues
3. **Color & Contrast** — WCAG contrast ratios, color consistency, dark/light mode
4. **Spacing & Layout** — Padding, margins, grid alignment, responsive concerns
5. **Accessibility** — Touch targets, alt text indicators, focus states, screen reader hints
6. **Interactive States** — Buttons, hover/press states, loading indicators, empty states

For each issue found, provide:
- **Severity**: Critical / Major / Minor / Suggestion
- **Category**: One of the categories above
- **Issue**: Clear description of what's wrong
- **Location**: Where on the screen (e.g., "top navigation bar", "card #2")
- **Recommendation**: How to fix it

End with a **Summary Score** out of 100 and a 1-2 sentence overall assessment.

Format the report in clean Markdown.`;

const DEMO_REPORT = `# ShipCheck Layout & Design Comparison Report

## Layout & Structure Issues

- **Severity**: **Critical**
- **Category**: Layout & Structure
- **Issue**: Hero section width mismatch
- **Design**: Full-width hero section spanning entire viewport edge-to-edge
- **Development**: Hero section constrained to centered container with max-width (appears ~1200px) and horizontal margins
- **Gap**: Section should be full-width but is contained, reducing visual impact
- **Recommendation**: Remove max-width container: <section className="w-full"> instead of <section className="max-w-7xl mx-auto">

- **Severity**: **Critical**
- **Category**: Layout & Structure
- **Issue**: Feature grid column count mismatch
- **Design**: Features section displays 4 columns in a grid layout
- **Development**: Features section displays 3 columns in a grid layout
- **Gap**: Missing one column, layout proportions incorrect
- **Recommendation**: Update grid to 4 columns: className="grid grid-cols-4 gap-6"

- **Severity**: **Major**
- **Category**: Layout & Structure
- **Issue**: Container padding inconsistency
- **Design**: Hero section has 80px horizontal padding from viewport edges
- **Development**: Hero section has 24px horizontal padding from viewport edges
- **Gap**: 56px less padding, content too close to edges
- **Recommendation**: Update padding: className="px-20" (80px = 20*4)

## Element Structure & Content

- **Severity**: **Critical**
- **Category**: Element Structure
- **Issue**: Search icon missing in header
- **Design**: Header contains search icon on the right side
- **Development**: Search icon is not present in implementation
- **Gap**: Essential navigation element missing
- **Recommendation**: Add search icon component to header: <SearchIcon className="h-5 w-5" />

- **Severity**: **Major**
- **Category**: Element Structure
- **Issue**: Card count mismatch in testimonials section
- **Design**: Testimonials section shows 6 customer cards
- **Development**: Testimonials section shows 4 customer cards
- **Gap**: 2 testimonial cards missing from implementation
- **Recommendation**: Add 2 more testimonial cards to match design specification

- **Severity**: **Major**
- **Category**: Element Structure
- **Issue**: Footer links missing
- **Design**: Footer contains "Privacy Policy" and "Terms of Service" links
- **Development**: Footer only shows copyright text, links missing
- **Gap**: Two navigation links not implemented
- **Recommendation**: Add footer links: <a href="/privacy">Privacy Policy</a> <a href="/terms">Terms of Service</a>

## Typography Discrepancies

- **Severity**: **Critical**
- **Category**: Typography
- **Issue**: Main heading font size mismatch
- **Design**: 32px font size, 700 weight, #1a1a1a color
- **Development**: 28px font size, 600 weight, #000000 color
- **Gap**: 4px smaller (12.5% reduction), lighter weight, pure black instead of dark gray
- **Recommendation**: Update to font-size: 32px; font-weight: 700; color: #1a1a1a;

- **Severity**: **Major**
- **Category**: Typography
- **Issue**: Body text size and color mismatch
- **Design**: 16px font size, 400 weight, #4a5568 color, 1.6 line-height
- **Development**: 14px font size, 400 weight, #6b7280 color, 1.4 line-height
- **Gap**: 2px smaller (12.5% reduction), lighter gray (#6b7280 vs #4a5568), tighter line-height
- **Recommendation**: Update to font-size: 16px; color: #4a5568; line-height: 1.6;

- **Severity**: **Major**
- **Category**: Typography
- **Issue**: Button text weight mismatch
- **Design**: 600 semibold, 14px
- **Development**: 500 medium, 14px
- **Gap**: One weight level lighter (600 → 500)
- **Recommendation**: Update button font-weight to 600

- **Severity**: **Minor**
- **Category**: Typography
- **Issue**: Label text size inconsistency
- **Design**: 12px font size, 500 weight, #64748b color
- **Development**: 13px font size, 400 weight, #64748b color
- **Gap**: 1px larger, lighter weight
- **Recommendation**: Update to font-size: 12px; font-weight: 500;

## Color Discrepancies

- **Severity**: **Critical**
- **Category**: Color
- **Issue**: Primary button background color mismatch
- **Design**: #4f46e5 (indigo-600)
- **Development**: #6366f1 (indigo-500)
- **Gap**: 14% lighter shade, noticeable brand color difference
- **Recommendation**: Update to background-color: #4f46e5;

- **Severity**: **Major**
- **Category**: Color
- **Issue**: Input placeholder text color too light
- **Design**: #9ca3af (gray-400), contrast ratio 4.5:1
- **Development**: #d1d5db (gray-300), contrast ratio 2.8:1
- **Gap**: 28% lighter, fails WCAG AA contrast requirements
- **Recommendation**: Update to color: #9ca3af; for placeholders

- **Severity**: **Major**
- **Category**: Color
- **Issue**: Border color mismatch on cards
- **Design**: #e5e7eb (gray-200)
- **Development**: #f3f4f6 (gray-100)
- **Gap**: One shade lighter, borders too subtle
- **Recommendation**: Update to border-color: #e5e7eb;

- **Severity**: **Minor**
- **Category**: Color
- **Issue**: Secondary text color slightly off
- **Design**: #6b7280 (gray-500)
- **Development**: #9ca3af (gray-400)
- **Gap**: 32% lighter
- **Recommendation**: Update to color: #6b7280;

## Spacing & Layout

- **Severity**: **Minor**
- **Category**: Spacing & Layout
- **Issue**: Inconsistent padding on form inputs
- **Design**: 12px vertical, 16px horizontal
- **Development**: 10px vertical, 16px horizontal
- **Gap**: 2px less vertical padding
- **Recommendation**: Update to padding: 12px 16px;

## Accessibility

- **Severity**: **Major**
- **Category**: Accessibility
- **Issue**: Low contrast on placeholder text fails WCAG AA
- **Design**: Meets 4.5:1 contrast ratio
- **Development**: Only 2.8:1 contrast ratio
- **Gap**: 1.7 points below minimum
- **Recommendation**: Darken placeholder color to #9ca3af or darker

---

## Match Score: **62 / 100**

**Layout & Structure Accuracy**: 55/100 - Hero section width mismatch (full-width vs contained), feature grid has 3 columns instead of 4, container padding significantly different (24px vs 80px).

**Element Structure Accuracy**: 70/100 - Missing search icon in header, 2 testimonial cards missing, footer links not implemented.

**Typography Accuracy**: 65/100 - Multiple font size and weight mismatches detected. Main heading is 12.5% smaller than design spec.

**Color Accuracy**: 70/100 - Primary brand color (#4f46e5 vs #6366f1) and several text colors don't match design. Placeholder text fails accessibility contrast requirements.

**Critical Fixes Needed**:
1. Fix hero section to full-width: remove max-width constraint
2. Update feature grid from 3 to 4 columns
3. Increase horizontal padding from 24px to 80px
4. Add 2 missing testimonial cards
5. Add missing search icon to header
6. Implement footer links (Privacy Policy, Terms of Service)
7. Restore heading to 32px with 700 weight
8. Fix primary button color to #4f46e5

---

*This is a demo report showing layout structure, element detection, typography, and color scanning capabilities. Connect your OpenAI API key for real AI-powered pixel-perfect analysis.*`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a comparison request (new format with design + development)
    const isComparison = body.design && body.development;

    if (isComparison) {
      // Comparison mode: design vs development
      const { design, development } = body;

      // Extract images/URLs from design and development
      let designImage = null;
      let devImage = null;

      // Get design image
      if (design.type === "screenshot" && design.image) {
        designImage = design.image;
      } else if (design.type === "figma" && design.figmaUrl) {
        // For now, Figma URLs are not supported - user must upload screenshot
        return NextResponse.json(
          { error: "Figma comparison is not yet supported. Please upload a screenshot of your design instead." },
          { status: 400 }
        );
      }

      // Get development image/URL
      if (development.type === "screenshot" && development.image) {
        devImage = development.image;
      } else if (development.type === "url" && development.url) {
        // For now, live URLs are not supported - user must upload screenshot
        return NextResponse.json(
          { error: "Live URL comparison is not yet supported. Please upload a screenshot of your developed version instead." },
          { status: 400 }
        );
      }

      if (!designImage || !devImage) {
        return NextResponse.json(
          { error: "Please provide screenshots for both design resource and developed version" },
          { status: 400 }
        );
      }

      // Demo mode: return a sample comparison report when OpenAI key is not configured
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ report: DEMO_REPORT });
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 6000,
        messages: [
          { role: "system", content: COMPARISON_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please compare these two screens with EXTREME ATTENTION to layout structure, missing elements, and typography precision:

1. First image: DESIGN RESOURCE (original design)
2. Second image: DEVELOPED VERSION (implementation)

CRITICAL INSTRUCTIONS - ANALYZE IN THIS ORDER:

1. LAYOUT & STRUCTURE (HIGHEST PRIORITY):
   - Compare container widths: Is a section full-width in design but constrained in development?
   - Count columns/items: Does design show 3 columns but development shows 2?
   - Check element positioning: Are elements stacked vertically vs horizontally?
   - Measure padding/margins: Different edge spacing between versions?
   - Example findings: "Design shows full-width hero section spanning entire viewport, Development has centered container with max-width and side margins"

2. MISSING/EXTRA ELEMENTS:
   - Count all visible elements (cards, buttons, icons, sections)
   - Identify any element present in one version but not the other
   - Example: "Design has 6 feature cards, Development only shows 4 cards"

3. TYPOGRAPHY PRECISION:
   - Carefully measure the actual HEIGHT of text characters in pixels
   - Compare the VISUAL SIZE of text between both images
   - If a heading appears smaller in development, measure and report the exact difference
   - Look at cap heights (uppercase letters) and x-heights (lowercase letters) for accurate measurement
   - Compare font size RATIOS: if design heading is 2x body text, dev should maintain same ratio
   - Provide measurements in pixels (e.g., "Design: 24px, Dev: 20px - 4px smaller")
   - If uncertain about exact pixel size, provide a range (e.g., "appears to be 14-16px")

4. COLOR ACCURACY:
   - Extract exact hex values for all colors
   - Compare backgrounds, text colors, borders, buttons

Identify ALL visual discrepancies with primary focus on layout structure and missing elements.`,
              },
              {
                type: "image_url",
                image_url: { url: designImage, detail: "high" },
              },
              {
                type: "image_url",
                image_url: { url: devImage, detail: "high" },
              },
            ],
          },
        ],
      });

      const report = response.choices[0]?.message?.content || "No analysis generated.";
      return NextResponse.json({ report });

    } else {
      // Legacy single-image mode
      const { image } = body;

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
        max_tokens: 6000,
        messages: [
          { role: "system", content: SINGLE_SCREEN_SYSTEM_PROMPT },
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
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
