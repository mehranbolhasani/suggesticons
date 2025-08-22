'use client'

import { useState } from 'react'
import IconSearch from './components/IconSearch'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            SuggestIcons
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Describe what you're looking for and get AI-powered icon suggestions 
            from popular libraries like Phosphor, Heroicons, and Lucide.
          </p>
        </div>
        
        <IconSearch />
      </div>
    </main>
  )
}
