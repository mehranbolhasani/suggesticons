'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface IconSuggestion {
  name: string
  library: string
  description: string
  url: string
  svgUrl: string
  svgContent?: string
}

export default function IconSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<IconSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setSuggestions([])

    try {
      const response = await fetch('/api/suggest-icons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err) {
      setError('Failed to get icon suggestions. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadSvg = async (suggestion: IconSuggestion) => {
    try {
      const svgContent = suggestion.svgContent && suggestion.svgContent.includes('<svg') 
        ? suggestion.svgContent 
        : getIconSvg(suggestion.library, suggestion.name)
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${suggestion.name}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download:', err)
    }
  }

  const copySvgCode = async (suggestion: IconSuggestion) => {
    try {
      const svgContent = suggestion.svgContent && suggestion.svgContent.includes('<svg') 
        ? suggestion.svgContent 
        : getIconSvg(suggestion.library, suggestion.name)
      await copyToClipboard(svgContent)
    } catch (err) {
      console.error('Failed to copy SVG:', err)
    }
  }

  // Get inline SVG for icon preview
  const getIconSvg = (library: string, iconName: string): string => {
    // Icon-specific SVGs based on icon name and library
    const iconSvgs: Record<string, string> = {
      // Phosphor icons (purple)
      'Phosphor-article': `<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" class="w-full h-full text-purple-500"><rect x="32" y="48" width="192" height="160" rx="8"/><line x1="64" y1="88" x2="192" y2="88"/><line x1="64" y1="120" x2="192" y2="120"/><line x1="64" y1="152" x2="128" y2="152"/></svg>`,
      'Phosphor-headset': `<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" class="w-full h-full text-purple-500"><path d="M128,24A104,104,0,0,0,24,128v40a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.13,88.13,0,0,1,128,40a88.13,88.13,0,0,1,87.64,80H192a24,24,0,0,0-24,24v24a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V128A104,104,0,0,0,128,24Z"/></svg>`,
      'Phosphor-question': `<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" class="w-full h-full text-purple-500"><circle cx="128" cy="128" r="96"/><path d="M96,108a32,32,0,1,1,32,32v12"/><circle cx="128" cy="180" r="12"/></svg>`,
      'Phosphor-lifebuoy': `<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" class="w-full h-full text-purple-500"><circle cx="128" cy="128" r="96"/><circle cx="128" cy="128" r="40"/><line x1="99.72" y1="99.72" x2="68.28" y2="68.28"/><line x1="156.28" y1="99.72" x2="187.72" y2="68.28"/><line x1="156.28" y1="156.28" x2="187.72" y2="187.72"/><line x1="99.72" y1="156.28" x2="68.28" y2="187.72"/></svg>`,
      
      // Heroicons (blue)
      'Heroicons-chat-bubble-left-ellipsis': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>`,
      'Heroicons-document-text': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
      
      // Lucide icons (green)
      'Lucide-help-circle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full text-green-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><point x="12" y="17"/></svg>`,
      'Lucide-headphones': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full text-green-500"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
    }
    
    // Try to get specific icon, fallback to library default
    const iconKey = `${library}-${iconName}`
    if (iconSvgs[iconKey]) {
      return iconSvgs[iconKey]
    }
    
    // Library fallback icons
    const libraryDefaults = {
      'Phosphor': `<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" class="w-full h-full text-purple-500"><rect x="64" y="64" width="128" height="128" rx="8"/><path d="M104,104h48v48"/></svg>`,
      'Heroicons': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`,
      'Lucide': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full text-green-500"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>`
    }
    
    return libraryDefaults[library as keyof typeof libraryDefaults] || libraryDefaults['Phosphor']
  }

  // Group suggestions by library
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const library = suggestion.library
    if (!groups[library]) {
      groups[library] = []
    }
    groups[library].push(suggestion)
    return groups
  }, {} as Record<string, IconSuggestion[]>)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the icon you need (e.g., summary, support, crowd-funding)"
            className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Finding perfect icons for you...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results - Grouped by Library */}
      {suggestions.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            Icon Suggestions for "{query}"
          </h2>
          
          {Object.entries(groupedSuggestions).map(([library, icons]) => (
            <div key={library} className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700 border-b border-slate-200 pb-2">
                {library}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {icons.map((suggestion, index) => (
                  <div
                    key={`${library}-${index}`}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    {/* Icon Preview */}
                    <div className="flex items-center justify-center w-16 h-16 bg-slate-50 rounded-lg mb-4 mx-auto">
                      {suggestion.svgContent && suggestion.svgContent.includes('<svg') && suggestion.svgContent.length < 2000 ? (
                        <div 
                          className="w-8 h-8 text-slate-600 overflow-hidden"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: suggestion.svgContent
                          }}
                        />
                      ) : (
                        <div 
                          className="w-8 h-8 text-slate-600"
                          dangerouslySetInnerHTML={{
                            __html: getIconSvg(suggestion.library, suggestion.name)
                          }}
                        />
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-slate-800 mb-2 text-center">
                      {suggestion.name}
                    </h4>
                    
                    <p className="text-sm text-slate-600 mb-4 text-center">
                      {suggestion.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => copySvgCode(suggestion)}
                        className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Copy SVG Code"
                      >
                        Copy SVG
                      </button>
                      
                      <button
                        onClick={() => downloadSvg(suggestion)}
                        className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Download SVG File"
                      >
                        Download
                      </button>
                      
                      <a
                        href={suggestion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View in Library"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && suggestions.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-slate-600">No suggestions found. Try a different description.</p>
        </div>
      )}
    </div>
  )
}
