# SuggestIcons 🎯

An AI-powered icon discovery service that helps you find the perfect icons from popular libraries by describing what you're looking for.

## 🚀 Features

- **AI-Powered Search**: Describe your icon needs in natural language (e.g., "summary", "support", "crowd-funding")
- **Multiple Icon Libraries**: Searches across Phosphor, Heroicons, and Lucide icon libraries
- **Intelligent Matching**: Uses OpenAI GPT to understand context and provide relevant suggestions
- **Fallback System**: Works even without AI API - uses smart keyword matching
- **Clean UI**: Ultra-minimal, responsive design built with Tailwind CSS
- **Fast Performance**: Built with Next.js for optimal loading speeds

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React and TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo API
- **Icons**: Phosphor, Heroicons, Lucide libraries
- **Deployment**: Ready for Vercel deployment

## 🏃‍♂️ Quick Start

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Get your API key from: https://platform.openai.com/api-keys

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 How It Works

1. **Describe Your Need**: Type what kind of icon you're looking for (e.g., "summary", "customer support")
2. **AI Analysis**: The system uses OpenAI to understand your request and match it with available icons
3. **Smart Results**: Get relevant icon suggestions from multiple libraries with explanations
4. **Easy Access**: Click through to view icons in their respective libraries

## 📁 Project Structure

```
suggesticons/
├── app/
│   ├── api/suggest-icons/     # API endpoint for icon suggestions
│   ├── components/            # React components
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Configuration

The app works in two modes:

1. **AI Mode** (with OpenAI API key): Provides intelligent, context-aware suggestions
2. **Fallback Mode** (without API key): Uses keyword matching for basic functionality

## 🚀 Deployment

Deploy easily to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

## 🤝 Contributing

Feel free to contribute by:
- Adding more icon libraries
- Improving the AI prompts
- Enhancing the UI/UX
- Adding new features

## 📝 License

MIT License - feel free to use this project for your own needs!