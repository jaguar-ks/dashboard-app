"use server"
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function getContactsServer(page = 1) {
  const { userId } = await auth()
  // Allow public access in development when not authenticated
  if (!userId) {
    const limit = 10
    const skip = Math.max(0, (page - 1) * limit)
    const contacts = await prisma.contact.findMany({ 
      skip, 
      take: limit, 
      orderBy: { createdAt: 'desc' } 
    })
    return { data: contacts, viewCount: null, limitReached: false }
  }

  // normalize to UTC midnight for a per-day record
  const now = new Date()
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  // find or create today's usage record
  let usage = await prisma.userUsage.findFirst({ where: { userId, date: todayUtc } })
  if (!usage) {
    usage = await prisma.userUsage.create({ data: { userId, date: todayUtc, viewCount: 0 } })
  }

  // Check if user has reached the limit
  if (usage.viewCount >= 50) {
    // Return the same 50 contacts they've already viewed today
    const limit = 10
    const skip = Math.max(0, (page - 1) * limit)
    const contacts = await prisma.contact.findMany({ 
      skip, 
      take: limit, 
      orderBy: { createdAt: 'desc' } 
    })
    
    return { data: contacts, viewCount: usage.viewCount, limitReached: true }
  }

  const limit = 10
  const skip = Math.max(0, (page - 1) * limit)
  
  // Calculate how many more contacts can be viewed
  const remainingViews = 50 - usage.viewCount
  const contactsToFetch = Math.min(limit, remainingViews)
  
  const contacts = await prisma.contact.findMany({ 
    skip, 
    take: contactsToFetch, 
    orderBy: { createdAt: 'desc' } 
  })

  const increment = contacts.length
  if (increment > 0) {
    await prisma.userUsage.update({ 
      where: { id: usage.id }, 
      data: { viewCount: { increment } } 
    })
    usage.viewCount += increment
  }

  return { data: contacts, viewCount: usage.viewCount, limitReached: usage.viewCount >= 50 }
}
