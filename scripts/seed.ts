import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function parseCSV(raw: string) {
  const lines: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      cur += ch
      continue
    }
    if (ch === '\n' && !inQuotes) {
      lines.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur) lines.push(cur)

  const rows = lines.map((l) => {
    const cols: string[] = []
    let val = ''
    let q = false
    for (let i = 0; i < l.length; i++) {
      const ch = l[i]
      if (ch === '"') {
        q = !q
        continue
      }
      if (ch === ',' && !q) {
        cols.push(val)
        val = ''
        continue
      }
      val += ch
    }
    cols.push(val)
    return cols
  })

  const headers = rows.shift() || []
  return rows.map((r) => Object.fromEntries(r.map((c, i) => [headers[i] || String(i), c === '' ? null : c])))
}

async function main() {
  const root = process.cwd()
  const agenciesPath = path.join(root, 'agencies_agency_rows.csv')
  const contactsPath = path.join(root, 'contacts_contact_rows.csv')

  if (!fs.existsSync(agenciesPath) || !fs.existsSync(contactsPath)) {
    console.error('CSV files not found in project root. Expected files: agencies_agency_rows.csv, contacts_contact_rows.csv')
    process.exit(1)
  }

  const agenciesRaw = fs.readFileSync(agenciesPath, 'utf8')
  const contactsRaw = fs.readFileSync(contactsPath, 'utf8')

  const agencies = parseCSV(agenciesRaw)
  const contacts = parseCSV(contactsRaw)

  console.log('Clearing existing data...')
  await prisma.contact.deleteMany()
  await prisma.agency.deleteMany()

  console.log(`Seeding ${agencies.length} agencies...`)
  const createdAgencies: Array<any> = []
  for (const a of agencies) {
    try {
      const created = await prisma.agency.create({
        data: {
          id: a['id'] || undefined,
          name: a['name'] || a['agency_name'] || 'Unknown Agency',
          city: a['city'] || null,
          state: a['state'] || null,
          address: a['address'] || null,
          zipcode: a['zipcode'] || a['postal_code'] || null,
          phone: a['phone'] || null,
          website: a['website'] || a['url'] || null,
        },
      })
      createdAgencies.push(created)
    } catch (err) {
      // ignore duplicate or bad rows
    }
  }

  if (createdAgencies.length === 0) {
    // create a fallback agency so contacts have somewhere to go
    const fallback = await prisma.agency.create({ data: { name: 'Default Agency' } })
    createdAgencies.push(fallback)
  }

  console.log(`Seeding ${contacts.length} contacts...`)
  for (const c of contacts) {
    try {
      // prefer agency_id column if present and matches
      let agencyId = c['agency_id'] || c['agencyId'] || null
      if (agencyId) {
        const found = createdAgencies.find((x) => x.id === agencyId)
        if (!found) agencyId = null
      }
      if (!agencyId) {
        const choose = createdAgencies[Math.floor(Math.random() * createdAgencies.length)]
        agencyId = choose.id
      }

      await prisma.contact.create({
        data: {
          id: c['id'] || undefined,
          firstName: c['first_name'] || c['firstName'] || null,
          lastName: c['last_name'] || c['lastName'] || null,
          email: c['email'] || null,
          phone: c['phone'] || null,
          title: c['title'] || null,
          emailType: c['email_type'] || null,
          contactFormUrl: c['contact_form_url'] || null,
          department: c['department'] || null,
          agencyId,
        },
      })
    } catch (err) {
      // ignore individual failures
    }
  }

  console.log('Seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
