import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface IconSuggestion {
  name: string
  library: string
  description: string
  url: string
  svgUrl: string
  svgContent?: string
}

// Icon libraries data with SVG URLs and API endpoints
const iconLibraries = {
  phosphor: {
    name: 'Phosphor',
    baseUrl: 'https://phosphoricons.com',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.0.3/assets',
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
      { name: 'heart', keywords: ['like', 'love', 'favorite', 'support', 'friendship'] },
      { name: 'star', keywords: ['favorite', 'rating', 'quality', 'premium'] },
      { name: 'shield-check', keywords: ['security', 'protection', 'verified', 'safe'] },
      { name: 'lightning', keywords: ['fast', 'quick', 'speed', 'energy'] },
      { name: 'gear', keywords: ['settings', 'configuration', 'options', 'preferences'] },
      { name: 'bell', keywords: ['notification', 'alert', 'reminder', 'news'] },
      { name: 'envelope', keywords: ['email', 'message', 'contact', 'mail'] },
      { name: 'music-notes', keywords: ['music', 'audio', 'sound', 'song', 'melody', 'tune'] },
      { name: 'microphone', keywords: ['music', 'audio', 'recording', 'voice', 'sound'] },
      { name: 'play', keywords: ['music', 'audio', 'play', 'start', 'begin'] },
      { name: 'pause', keywords: ['music', 'audio', 'pause', 'stop', 'break'] },
      { name: 'handshake', keywords: ['friendship', 'partnership', 'agreement', 'cooperation'] },
      { name: 'smiley', keywords: ['friendship', 'happy', 'emotion', 'positive', 'joy'] },
      { name: 'gift', keywords: ['friendship', 'present', 'giving', 'celebration'] }
    ]
  },
  heroicons: {
    name: 'Heroicons',
    baseUrl: 'https://heroicons.com',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline',
    icons: [
      { name: 'document-text', keywords: ['summary', 'document', 'text', 'report'] },
      { name: 'clipboard-document-list', keywords: ['summary', 'checklist', 'overview'] },
      { name: 'chart-bar-square', keywords: ['summary', 'analytics', 'dashboard'] },
      { name: 'chat-bubble-left-ellipsis', keywords: ['support', 'chat', 'help'] },
      { name: 'question-mark-circle', keywords: ['support', 'help', 'faq'] },
      { name: 'users', keywords: ['crowd-funding', 'community', 'team', 'friendship', 'people'] },
      { name: 'banknotes', keywords: ['crowd-funding', 'money', 'funding'] },
      { name: 'currency-dollar', keywords: ['money', 'finance', 'funding'] },
      { name: 'rocket-launch', keywords: ['launch', 'startup', 'project'] },
      { name: 'heart', keywords: ['like', 'favorite', 'love', 'friendship'] },
      { name: 'star', keywords: ['rating', 'favorite', 'quality'] },
      { name: 'shield-check', keywords: ['security', 'verified', 'protection'] },
      { name: 'bolt', keywords: ['fast', 'energy', 'power'] },
      { name: 'cog-6-tooth', keywords: ['settings', 'configuration'] },
      { name: 'bell', keywords: ['notification', 'alert'] },
      { name: 'musical-note', keywords: ['music', 'audio', 'sound', 'song', 'melody'] },
      { name: 'microphone', keywords: ['music', 'audio', 'recording', 'voice'] },
      { name: 'speaker-wave', keywords: ['music', 'audio', 'sound', 'volume'] },
      { name: 'play', keywords: ['music', 'audio', 'play', 'start'] },
      { name: 'pause', keywords: ['music', 'audio', 'pause', 'stop'] },
      { name: 'hand-raised', keywords: ['friendship', 'greeting', 'hello', 'wave'] },
      { name: 'face-smile', keywords: ['friendship', 'happy', 'emotion', 'positive'] },
      { name: 'gift', keywords: ['friendship', 'present', 'giving', 'celebration'] }
    ]
  },
  lucide: {
    name: 'Lucide',
    baseUrl: 'https://lucide.dev',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/lucide-static@0.400.0/icons',
    icons: [
      { name: 'file-text', keywords: ['summary', 'document', 'text'] },
      { name: 'list', keywords: ['summary', 'list', 'items'] },
      { name: 'bar-chart-3', keywords: ['summary', 'analytics', 'data'] },
      { name: 'headphones', keywords: ['support', 'help', 'customer-service', 'music', 'audio'] },
      { name: 'help-circle', keywords: ['support', 'help', 'question'] },
      { name: 'users', keywords: ['crowd-funding', 'community', 'people', 'friendship'] },
      { name: 'dollar-sign', keywords: ['crowd-funding', 'money', 'funding'] },
      { name: 'coins', keywords: ['funding', 'money', 'finance'] },
      { name: 'rocket', keywords: ['launch', 'startup', 'growth'] },
      { name: 'heart', keywords: ['like', 'love', 'favorite', 'friendship'] },
      { name: 'star', keywords: ['rating', 'favorite', 'premium'] },
      { name: 'shield-check', keywords: ['security', 'protection'] },
      { name: 'zap', keywords: ['fast', 'energy', 'lightning'] },
      { name: 'settings', keywords: ['configuration', 'options'] },
      { name: 'bell', keywords: ['notification', 'alert'] },
      { name: 'music', keywords: ['music', 'audio', 'sound', 'song', 'melody'] },
      { name: 'mic', keywords: ['music', 'audio', 'recording', 'voice', 'microphone'] },
      { name: 'volume-2', keywords: ['music', 'audio', 'sound', 'speaker', 'volume'] },
      { name: 'play', keywords: ['music', 'audio', 'play', 'start'] },
      { name: 'pause', keywords: ['music', 'audio', 'pause', 'stop'] },
      { name: 'handshake', keywords: ['friendship', 'partnership', 'agreement', 'cooperation'] },
      { name: 'smile', keywords: ['friendship', 'happy', 'emotion', 'positive'] },
      { name: 'gift', keywords: ['friendship', 'present', 'giving', 'celebration'] },
      { name: 'users-2', keywords: ['friendship', 'couple', 'pair', 'duo'] }
    ]
  }
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    let suggestions: IconSuggestion[] = []

    // Try Gemini AI first
    if (process.env.GEMINI_API_KEY) {
      try {
        suggestions = await getAISuggestions(query)
      } catch (error) {
        console.error('Gemini AI failed, falling back to keyword matching:', error)
        suggestions = fallbackIconSearch(query)
      }
    } else {
      // Fallback to keyword matching if no API key
      suggestions = fallbackIconSearch(query)
    }

    // Fetch SVG content server-side to avoid CORS issues
    const suggestionsWithSvg = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          const response = await fetch(suggestion.svgUrl)
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          let svgContent = await response.text()
          
          // Extract only the SVG content
          const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i)
          if (!svgMatch) {
            throw new Error('No valid SVG found')
          }
          
          svgContent = svgMatch[0]
            // Remove existing width/height attributes
            .replace(/\s*width="[^"]*"/g, '')
            .replace(/\s*height="[^"]*"/g, '')
            // Remove class attributes that might interfere
            .replace(/\s*class="[^"]*"/g, '')
            // Add proper sizing
            .replace(/<svg([^>]*)>/i, '<svg$1 width="24" height="24">')
            // Clean up whitespace
            .replace(/\s+/g, ' ')
            .trim()
          
          return { ...suggestion, svgContent }
        } catch (error) {
          console.error(`Failed to fetch SVG for ${suggestion.name}:`, error)
          return suggestion
        }
      })
    )

    return NextResponse.json({ suggestions: suggestionsWithSvg })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getAISuggestions(query: string) {
  const prompt = `You are an expert at matching user intent to appropriate icons. Given the query "${query}", analyze the user's intent and suggest the most semantically relevant icons.

Available icons by library:
${Object.entries(iconLibraries).map(([key, lib]) => 
  `${lib.name}: ${lib.icons.map(icon => `${icon.name} (${icon.keywords.join(', ')})`).join(', ')}`
).join('\n')}

Instructions:
1. Understand the user's intent behind "${query}"
2. Consider both literal and metaphorical meanings
3. Prioritize icons that best represent the concept, not just keyword matches
4. Return only highly relevant icons (quality over quantity)
5. Provide clear explanations for why each icon fits

Return a JSON array of the top 6 most relevant icons:
[
  {
    "name": "icon-name",
    "library": "Library Name", 
    "description": "Clear explanation of why this icon represents '${query}'",
    "url": "library-base-url",
    "svgUrl": "cdn-url-to-svg-file"
  }
]

Focus on precision and relevance over quantity.`

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
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 1)

  Object.entries(iconLibraries).forEach(([key, library]) => {
    library.icons.forEach(icon => {
      const score = calculateRelevanceScore(queryWords, icon.keywords)
      if (score >= 2) { // Only include icons with meaningful relevance
        const svgUrl = getSvgUrl(library, icon.name)
        
        // Generate more contextual descriptions
        const bestKeywords = icon.keywords
          .filter(keyword => queryWords.some(word => 
            keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())
          ))
          .slice(0, 2)
        
        const description = bestKeywords.length > 0 
          ? `Perfect for ${bestKeywords.join(' and ')} related to ${query}`
          : `Represents ${icon.keywords.slice(0, 2).join(' and ')}`
        
        suggestions.push({
          name: icon.name,
          library: library.name,
          description,
          url: library.baseUrl,
          svgUrl,
          score
        })
      }
    })
  })

  // Sort by score and limit to top results
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 8) // Increased to 8 for better variety
    .map(({ score, ...suggestion }) => suggestion)
}

function getSvgUrl(library: any, iconName: string): string {
  switch (library.name) {
    case 'Phosphor':
      return `${library.cdnUrl}/regular/${iconName}.svg`
    case 'Heroicons':
      return `${library.cdnUrl}/${iconName}.svg`
    case 'Lucide':
      return `${library.cdnUrl}/${iconName}.svg`
    default:
      return ''
  }
}

function calculateRelevanceScore(queryWords: string[], keywords: string[]): number {
  let score = 0
  const queryLower = queryWords.map(w => w.toLowerCase())
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    
    queryLower.forEach(word => {
      // Exact match gets highest score
      if (keywordLower === word) {
        score += 10
      }
      // Word starts with query word
      else if (keywordLower.startsWith(word) || word.startsWith(keywordLower)) {
        score += 5
      }
      // Word contains query word or vice versa
      else if (keywordLower.includes(word) || word.includes(keywordLower)) {
        score += 2
      }
      // Semantic similarity for common concepts
      else if (areSemanticallySimilar(word, keywordLower)) {
        score += 3
      }
    })
  })
  
  return score
}

function areSemanticallySimilar(word1: string, word2: string): boolean {
  const semanticGroups = [
    ['music', 'audio', 'sound', 'song', 'melody', 'tune'],
    ['support', 'help', 'assistance', 'aid', 'service'],
    ['money', 'finance', 'funding', 'payment', 'cash', 'dollar'],
    ['people', 'users', 'community', 'group', 'team'],
    ['document', 'file', 'text', 'paper', 'report'],
    ['settings', 'configuration', 'options', 'preferences'],
    ['notification', 'alert', 'bell', 'reminder'],
    ['security', 'protection', 'shield', 'safe'],
    ['fast', 'quick', 'speed', 'rapid', 'lightning'],
    ['favorite', 'like', 'love', 'heart', 'star']
  ]
  
  return semanticGroups.some(group => 
    group.includes(word1) && group.includes(word2)
  )
}
