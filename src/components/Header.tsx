'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            🤖 AI Events AMS
          </Link>

          <nav className="hidden md:flex space-x-8">
            <a href="#events" className="text-gray-600 hover:text-gray-900 transition-colors">
              Events
            </a>
            <a href="/api/events?format=ics" className="text-gray-600 hover:text-gray-900 transition-colors">
              Subscribe
            </a>
            <a href="https://github.com/JDerekLomas/aieventsamsterdam" className="text-gray-600 hover:text-gray-900 transition-colors">
              GitHub
            </a>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#events" className="text-gray-600 hover:text-gray-900 transition-colors">
                Events
              </a>
              <a href="/api/events?format=ics" className="text-gray-600 hover:text-gray-900 transition-colors">
                Subscribe
              </a>
              <a href="https://github.com/JDerekLomas/aieventsamsterdam" className="text-gray-600 hover:text-gray-900 transition-colors">
                GitHub
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}