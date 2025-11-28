"use client"
import React from 'react'

export type Agency = {
  id: string
  name: string
  city?: string | null
  state?: string | null
  address?: string | null
  zipcode?: string | null
  phone?: string | null
  website?: string | null
}

type Props = {
  agency: Agency
}

export default function AgencyCard({ agency: a }: Props) {
  return (
    <a
      key={a.id}
      href={a.website || '#'}
      target={a.website ? '_blank' : '_self'}
      rel={a.website ? 'noopener noreferrer' : undefined}
      className={`group w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 ${a.website ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={!a.website ? (e) => e.preventDefault() : undefined}
      style={{ minHeight: 180 }}
    >
      {/* Centered circular avatar */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-700 dark:text-zinc-200">
          {a.name.charAt(0)}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Name and status centered */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white text-center mb-1 truncate w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {a.name}
      </h3>
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4 border border-emerald-100 dark:border-emerald-900/50">
        Active
      </span>

      {/* Location pill centered */}
      {(a.city || a.state) && (
        <span className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400">
          <svg className="w-4 h-4 mr-1.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {a.city && a.state ? `${a.city}, ${a.state}` : a.city || a.state}
          {a.zipcode && <span className="text-zinc-400 dark:text-zinc-600 ml-1 font-normal">{a.zipcode}</span>}
        </span>
      )}
    </a>
  )
}

