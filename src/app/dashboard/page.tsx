"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UpgradeModal from '@/components/UpgradeModal'
import AgencyCard from '@/components/AgencyCard'
import ContactCard from '@/components/ContactCard'

type Agency = {
  id: string
  name: string
  city?: string | null
  state?: string | null
  address?: string | null
  zipcode?: string | null
  phone?: string | null
  website?: string | null
}

type Contact = {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  title?: string | null
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as 'agencies' | 'contacts' | null
  const [activeTab, setActiveTab] = useState<'agencies' | 'contacts'>(tabParam || 'agencies')
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [allAgencies, setAllAgencies] = useState<Agency[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [page, setPage] = useState(1)
  const [agencyPage, setAgencyPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [pageTransition, setPageTransition] = useState(false)

  const itemsPerPage = 8

  // Fetch agencies
  useEffect(() => {
    if (activeTab !== 'agencies') return
    setLoading(true)
    setPageTransition(true)
    fetch('/api/agencies')
      .then((r) => r.json())
      .then((res) => {
        const data = res.data || []
        setAllAgencies(data)
        // Paginate agencies
        const start = (agencyPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        setAgencies(data.slice(start, end))
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false)
        setTimeout(() => setPageTransition(false), 50)
      })
  }, [activeTab, agencyPage])

  // Fetch contacts
  useEffect(() => {
    if (activeTab !== 'contacts') return
    setLoading(true)
    setPageTransition(true)
    fetch(`/api/contacts?page=${page}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) {
          console.error(res.error)
          setContacts([])
        } else {
          setContacts(res.data || [])
          setViewCount(res.viewCount ?? null)
          // Track if limit is reached
          if (res.limitReached) {
            setLimitReached(true)
          } else {
            setLimitReached(false)
          }

          // Show modal only when on final page (page 5) and limit is reached
          // 50 contacts / 10 per page = 5 pages
          const isOnFinalPage = page === 5
          if (res.limitReached && isOnFinalPage) {
            setShowUpgradeModal(true)
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false)
        setTimeout(() => setPageTransition(false), 50)
      })
  }, [activeTab, page])

  return (
    <div className="w-full animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your agencies and contacts efficiently.</p>
        </div>

        {/* Minimal Tabs */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('agencies')
              setAgencyPage(1)
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'agencies'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
          >
            Agencies
          </button>
          <button
            onClick={() => {
              setActiveTab('contacts')
              setPage(1)
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'contacts'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
          >
            Contacts
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div className={`transition - opacity duration - 300 ${pageTransition ? 'opacity-0' : 'opacity-100'} `}>
            {agencies.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p>No agencies found</p>
              </div>
            ) : (
              <>
                {/* Scrollable Grid Container */}
                <div className="relative">
                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {agencies.map((a, i) => (
                        <div key={a.id} className="animate-slide-up" style={{ animationDelay: `${i * 50} ms` }}>
                          <AgencyCard agency={a} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Side Pagination Arrows */}
                  {allAgencies.length > itemsPerPage && (
                    <>
                      <button
                        onClick={() => setAgencyPage((p) => Math.max(1, p - 1))}
                        disabled={agencyPage === 1 || loading}
                        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => setAgencyPage((p) => p + 1)}
                        disabled={agencyPage >= Math.ceil(allAgencies.length / itemsPerPage) || loading}
                        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Page Indicator */}
                      <div className="flex items-center justify-center mt-6">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Page {agencyPage} of {Math.ceil(allAgencies.length / itemsPerPage)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className={`transition - opacity duration - 300 ${pageTransition ? 'opacity-0' : 'opacity-100'} `}>
            {viewCount !== null && (
              <div className="mb-4 text-xs text-zinc-500 text-right">
                Daily views: <span className="font-medium text-zinc-900 dark:text-zinc-200">{viewCount}/50</span>
              </div>
            )}

            {contacts.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p>No contacts found</p>
              </div>
            ) : (
              <>
                {/* Scrollable Grid Container */}
                <div className="relative">
                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {contacts.map((c, i) => (
                        <div key={c.id} className="animate-slide-up" style={{ animationDelay: `${i * 50} ms` }}>
                          <ContactCard contact={c} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Side Pagination Arrows */}
                  <>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loading || contacts.length === 0 || (limitReached && page >= 5)}
                      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Page Indicator */}
                    <div className="flex items-center justify-center mt-6">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Page {agencyPage} of {Math.ceil(allAgencies.length / itemsPerPage)}
                        </span>
                    </div>
                  </>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
