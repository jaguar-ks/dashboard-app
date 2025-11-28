import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const agencies = await prisma.agency.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ data: agencies })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
