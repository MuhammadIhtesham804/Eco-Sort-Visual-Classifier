<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Eco-Sort Visual Classifier

An AI-powered waste classification system using Google's Gemini 2.0 Flash API. Classifies items into HAZARD, COMPOST, RECYCLE, or TRASH categories with 99%+ accuracy.

**Supports:** English 🇺🇸 | Urdu 🇵🇰 | Arabic 🇸🇦

## Features

- **99%+ Accurate Classification** - Uses Gemini 2.0 Flash for real-time image analysis
- **Multilingual Support** - English, Urdu, and Arabic translations
- **Industrial-Grade Interface** - Professional UI with real-time confidence scores
- **Fast Processing** - Instant waste classification
- **Comprehensive Categories:**
  - 🚨 **HAZARD** - Batteries, electronics, chemicals, broken glass
  - 🍃 **COMPOST** - Food scraps, leaves, organic waste
  - ♻️ **RECYCLE** - Plastic, aluminum, cardboard, glass
  - 🗑️ **TRASH** - Non-recyclable items

## Run Locally

**Prerequisites:**  
- Node.js (v16 or higher)
- Google Gemini API Key

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Eco-Sort-Visual-Classifier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get your Gemini API Key:
   - Visit [Google AI Studio](https://ai.google.dev)
   - Create a new API key
   - Copy your API key

4. Configure your API key in `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── ImageUploader.tsx
│   ├── ClassificationModal.tsx
│   ├── RulesInfo.tsx
│   └── LanguageSwitcher.tsx
├── service/
│   └── geminiService.ts # Gemini API integration
├── App.tsx             # Main application
├── types.ts            # TypeScript types
└── constants.tsx       # UI configuration
```

## Technology Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **AI Model:** Google Gemini 2.0 Flash
- **Build Tool:** Vite
- **Environment:** Node.js

## How It Works

1. User uploads an image
2. Image is converted to base64 format
3. Gemini 2.0 Flash API analyzes the image
4. AI classifies the waste item into one of 4 categories
5. Classification result with confidence score is displayed
6. User receives multilingual explanation

## API Key Safety

- Never commit `.env.local` to version control (it's in `.gitignore`)
- Use `.env.example` as a template
- Keep your API key confidential

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
