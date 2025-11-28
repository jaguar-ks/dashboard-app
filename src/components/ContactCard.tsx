"use client"
import React from 'react'

export type Contact = {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  title?: string | null
}

type Props = {
  contact: Contact
}

export default function ContactCard({ contact: c }: Props) {
  return (
    <div
      key={c.id}
      className="group w-full relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-bold text-xl">
            {(c.firstName?.[0] || c.lastName?.[0] || '?').toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1 truncate">
            {[c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown'}
          </h3>
          {c.title && (
            <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {c.title}
            </div>
          )}
        </div>
      </div>

      {/* Email + Phone side-by-side */}
      <div className="flex flex-col sm:flex-row gap-4">
        {c.email && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex-1 group/item hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors">
            <svg className="w-4 h-4 text-zinc-400 group-hover/item:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate font-medium flex-1">{c.email}</span>
          </div>
        )}
        {c.phone && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex-1 group/item hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors">
            <svg className="w-4 h-4 text-zinc-400 group-hover/item:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate font-medium flex-1">{c.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

