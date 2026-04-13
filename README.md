# AI Preset Generator + Caption & Hashtag Engine

A production-ready full-stack web application that uses AI to analyze images, suggest professional photo presets, and generate viral captions and hashtags.

## Features
- **AI-Powered Analysis**: Deep image understanding using OpenAI GPT-4o Vision.
- **Smart Presets**: Automatic generation of editing values (brightness, contrast, saturation, etc.).
- **Content Engine**: Viral Instagram captions and 20 optimized hashtags.
- **Real-time Processing**: Image transformation using Sharp.
- **Before/After Preview**: Interactive slider to compare original and processed images.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, TypeScript.
- **Backend**: Node.js, Express, Sharp, OpenAI API, TypeScript.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- OpenAI API Key

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example` and add your `OPENAI_API_KEY`.
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Local Development
- Backend: http://localhost:4000
- Frontend: http://localhost:3000

## API Documentation
### POST /api/analyze
Analyzes an image and returns processing results.
- **Body**: `multipart/form-data` with an `image` file.
- **Response**: `ProcessResult` object (see `shared/types.ts`).
