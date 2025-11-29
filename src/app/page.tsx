'use client'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

export default function HomePage() {
  const { toggleTheme } = useTheme()

  const cards = [
    {
      emoji: '🏢',
      title: 'Agencies',
      description: 'Browse and manage all agencies',
      href: '/dashboard?tab=agencies',
    },
    {
      emoji: '👥',
      title: 'Contacts',
      description: 'Access up to 50 contacts daily',
      href: '/dashboard?tab=contacts',
    },
  ]

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 animate-slide-up">
          Welcome to Your
          <span className="block mt-2 text-indigo-600 dark:text-indigo-400">
            Dashboard
          </span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto animate-slide-up delay-100">
          Manage your agencies and contacts in one place. Track usage, view insights, and stay organized.
        </p>
        <div className="flex justify-center mb-12 animate-slide-up delay-200">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Open Dashboard
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const CardWrapper = card.href ? Link : 'button'
            return (
              <CardWrapper
                key={card.title}
                href={card.href as string}
                className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer animate-slide-up"
                style={{
                  animationDelay: `${300 + index * 100}ms`,
                }}
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {card.emoji}
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{card.description}</p>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </div>
  )
}

