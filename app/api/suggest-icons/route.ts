import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Icon libraries data
const iconLibraries = {
  phosphor: {
    name: 'Phosphor',
    baseUrl: 'https://phosphoricons.com',
    icons: [
      { name: 'article', keywords: ['summary', 'document', 'text', 'content', 'article', 'blog'] },
      { name: 'list-bullets', keywords: ['summary', 'list', 'items', 'bullet-points', 'overview'] },
      { name: 'note', keywords: ['summary', 'notes', 'memo', 'brief', 'outline'] },
      { name: 'file-text', keywords: ['document', 'summary', 'report', 'text-file'] },
      { name: 'chart-bar', keywords: ['summary', 'analytics', 'data', 'statistics', 'overview'] },
      { name: 'headset', keywords: ['support', 'help', 'customer-service', 'assistance'] },
      { name: 'question', keywords: ['support', 'help', 'faq', 'question-mark'] },
      { name: 'lifebuoy', keywords: ['support', 'help', 'rescue', 'assistance'] },
      { name: 'users-three', keywords: ['crowd-funding', 'community', 'group', 'people'] },
      { name: 'hand-coins', keywords: ['crowd-funding', 'donation', 'money', 'funding'] },
      { name: 'currency-dollar', keywords: ['crowd-funding', 'money', 'funding', 'finance'] },
      { name: 'target', keywords: ['goal', 'objective', 'aim', 'target'] },
      { name: 'rocket', keywords: ['launch', 'startup', 'project', 'growth'] },
      { name: 'heart', keywords: ['like', 'love', 'favorite', 'support'] },
      { name: 'star', keywords: ['favorite', 'rating', 'quality', 'premium'] },
      { name: 'shield-check', keywords: ['security', 'protection', 'verified', 'safe'] },
      { name: 'lightning', keywords: ['fast', 'quick', 'speed', 'energy'] },
      { name: 'gear', keywords: ['settings', 'configuration', 'options', 'preferences'] },
      { name: 'bell', keywords: ['notification', 'alert', 'reminder', 'news'] },
      { name: 'envelope', keywords: ['email', 'message', 'contact', 'mail'] }
    ]
  },
  heroicons: {
    name: 'Heroicons',
    baseUrl: 'https://heroicons.com',
    icons: [
      { name: 'document-text', keywords: ['summary', 'document', 'text', 'report'] },
      { name: 'clipboard-document-list', keywords: ['summary', 'checklist', 'overview'] },
      { name: 'chart-bar-square', keywords: ['summary', 'analytics', 'dashboard'] },
      { name: 'chat-bubble-left-ellipsis', keywords: ['support', 'chat', 'help'] },
      { name: 'question-mark-circle', keywords: ['support', 'help', 'faq'] },
      { name: 'users', keywords: ['crowd-funding', 'community', 'team'] },
      { name: 'banknotes', keywords: ['crowd-funding', 'money', 'funding'] },
      { name: 'currency-dollar', keywords: ['money', 'finance', 'funding'] },
      { name: 'rocket-launch', keywords: ['launch', 'startup', 'project'] },
      { name: 'heart', keywords: ['like', 'favorite', 'love'] },
      { name: 'star', keywords: ['rating', 'favorite', 'quality'] },
      { name: 'shield-check', keywords: ['security', 'verified', 'protection'] },
      { name: 'bolt', keywords: ['fast', 'energy', 'power'] },
      { name: 'cog-6-tooth', keywords: ['settings', 'configuration'] },
      { name: 'bell', keywords: ['notification', 'alert'] }
    ]
  },
  lucide: {
    name: 'Lucide',
    baseUrl: 'https://lucide.dev',
    icons: [
      { name: 'file-text', keywords: ['summary', 'document', 'text'] },
      { name: 'list', keywords: ['summary', 'list', 'items'] },
      { name: 'bar-chart-3', keywords: ['summary', 'analytics', 'data'] },
      { name: 'headphones', keywords: ['support', 'help', 'customer-service'] },
      { name: 'help-circle', keywords: ['support', 'help', 'question'] },
      { name: 'users', keywords: ['crowd-funding', 'community', 'people'] },
      { name: 'dollar-sign', keywords: ['crowd-funding', 'money', 'funding'] },
      { name: 'coins', keywords: ['funding', 'money', 'finance'] },
      { name: 'rocket', keywords: ['launch', 'startup', 'growth'] },
      { name: 'heart', keywords: ['like', 'love', 'favorite'] },
      { name: 'star', keywords: ['rating', 'favorite', 'premium'] },
      { name: 'shield-check', keywords: ['security', 'protection'] },
      { name: 'zap', keywords: ['fast', 'energy', 'lightning'] },
      { name: 'settings', keywords: ['configuration', 'options'] },
      { name: 'bell', keywords: ['notification', 'alert'] }
    ]
  }
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  let query = ''
  
  try {
    const body = await request.json()
    query = body.query

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Try Gemini AI first, then fallback to keyword matching
    let suggestions
    
    if (process.env.GEMINI_API_KEY) {
      try {
        suggestions = await getGeminiSuggestions(query)
      } catch (geminiError) {
        console.log('Gemini failed, using fallback...', geminiError)
        suggestions = fallbackIconSearch(query.toLowerCase())
      }
    } else {
      console.log('No Gemini API key, using fallback...')
      suggestions = fallbackIconSearch(query.toLowerCase())
    }

    return NextResponse.json({ suggestions })

  } catch (error) {
    console.error('API Error:', error)
    
    // Fallback to keyword matching if AI fails
    const fallbackSuggestions = fallbackIconSearch(query.toLowerCase() || 'icon')
    return NextResponse.json({ suggestions: fallbackSuggestions })
  }
}

async function getGeminiSuggestions(query: string) {
  const prompt = `Given the user query "${query}", suggest the most relevant icons from these libraries:

${Object.entries(iconLibraries).map(([key, lib]) => 
  `${lib.name}: ${lib.icons.map(icon => `${icon.name} (${icon.keywords.join(', ')})`).join(', ')}`
).join('\n')}

Return a JSON array of the top 6 most relevant icons with this structure:
[
  {
    "name": "icon-name",
    "library": "Library Name",
    "description": "Brief description of why this icon fits the query",
    "url": "library-base-url"
  }
]

Focus on semantic meaning and context, not just keyword matching.`

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    
    const suggestions = JSON.parse(jsonMatch[0])
    return suggestions.slice(0, 6)
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', parseError)
    return fallbackIconSearch(query.toLowerCase())
  }
}

function fallbackIconSearch(query: string): any[] {
  const suggestions: any[] = []
  const queryWords = query.split(' ')

  Object.entries(iconLibraries).forEach(([key, library]) => {
    library.icons.forEach(icon => {
      const score = calculateRelevanceScore(queryWords, icon.keywords)
      if (score > 0) {
        suggestions.push({
          name: icon.name,
          library: library.name,
          description: `Icon that represents ${icon.keywords.slice(0, 3).join(', ')}`,
          url: library.baseUrl,
          score
        })
      }
    })
  })

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...suggestion }) => suggestion)
}

function calculateRelevanceScore(queryWords: string[], keywords: string[]): number {
  let score = 0
  queryWords.forEach(word => {
    keywords.forEach(keyword => {
      if (keyword.includes(word) || word.includes(keyword)) {
        score += keyword === word ? 3 : 1
      }
    })
  })
  return score
}
