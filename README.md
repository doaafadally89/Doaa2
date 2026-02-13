# ShipCheck — AI-Powered Design QA

Catch every UI bug before your users do. ShipCheck scans your screens for visual inconsistencies, accessibility issues, and design spec violations.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Firebase and OpenAI API keys in `.env.local`.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Firebase Authentication** (Email/Password + Google)
- **OpenAI GPT-4o** (Vision API for design analysis)
- **Lucide React** (Icons)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login / Sign up
│   ├── dashboard/page.tsx    # Upload & QA report
│   ├── api/analyze/route.ts  # OpenAI analysis endpoint
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles & theme
├── context/
│   └── AuthContext.tsx        # Firebase auth context
└── lib/
    └── firebase.ts           # Firebase config & helpers
```
