import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Purebook database...')

  const member = await prisma.member.upsert({
    where:  { email: 'owner@purebook.dev' },
    update: {},
    create: {
      memberId:     'M00001',
      firstName:    'Naith',
      lastName:     'Owner',
      email:        'owner@purebook.dev',
      passwordHash: await bcrypt.hash('purebook2024!', 10),
      role:         'SALON_ADMIN',
    },
  })
  console.log('✅ Member:', member.email)

  const site = await prisma.site.upsert({
    where:  { siteId: 'S00001' },
    update: {},
    create: {
      siteId:            'S00001',
      salonName:         'Purebook Demo Salon',
      location:          'London, UK',
      contactNumber:     '+44 20 1234 5678',
      email:             'hello@purebook.dev',
      passwordHash:      await bcrypt.hash('salon2024!', 10),
      memberId:          member.id,
      subscriptionTier:  'PRO',
      subscriptionStatus:'ACTIVE',
      trialEndsAt:       new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      workingHours: {
        monday:    { open: '09:00', close: '18:00', isOpen: true },
        tuesday:   { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '20:00', isOpen: true },
        thursday:  { open: '09:00', close: '20:00', isOpen: true },
        friday:    { open: '09:00', close: '18:00', isOpen: true },
        saturday:  { open: '09:00', close: '17:00', isOpen: true },
        sunday:    { open: null,    close: null,    isOpen: false },
      },
    },
  })
  console.log('✅ Site:', site.salonName)

  const specialistsData = [
    { staffId: 'ST00001', firstName: 'Maya',  lastName: 'Osei',   email: 'maya@purebook.dev',  pin: '1234', role: 'STAFF' as const,   target: 4500 },
    { staffId: 'ST00002', firstName: 'Priya', lastName: 'Nair',   email: 'priya@purebook.dev', pin: '2345', role: 'STAFF' as const,   target: 4200 },
    { staffId: 'ST00003', firstName: 'James', lastName: 'Hart',   email: 'james@purebook.dev', pin: '3456', role: 'STAFF' as const,   target: 3500 },
    { staffId: 'ST00004', firstName: 'Suki',  lastName: 'Yamada', email: 'suki@purebook.dev',  pin: '4567', role: 'MANAGER' as const, target: 3200 },
  ]

  for (const s of specialistsData) {
    await prisma.specialist.upsert({
      where:  { staffId: s.staffId },
      update: {},
      create: {
        staffId:             s.staffId,
        siteId:              site.id,
        memberId:            member.id,
        firstName:           s.firstName,
        lastName:            s.lastName,
        email:               s.email,
        phoneMobile:         '+44 7700 900000',
        status:              'Active',
        role:                s.role,
        pin:                 await bcrypt.hash(s.pin, 10),
        monthlyRevenueTarget:s.target,
        commissionRate:      5,
      },
    })
  }
  console.log('✅ Specialists: Maya, Priya, James, Suki')

  const cats = [
    { categoryId: 'CAT001', name: 'Hair colour' },
    { categoryId: 'CAT002', name: 'Cuts & styling' },
    { categoryId: 'CAT003', name: 'Lashes' },
    { categoryId: 'CAT004', name: 'Nails' },
  ]
  const categories: any[] = []
  for (const c of cats) {
    const cat = await prisma.category.upsert({
      where:  { categoryId: c.categoryId },
      update: {},
      create: { ...c, siteId: site.id, memberId: member.id, status: 'ACTIVE' },
    })
    categories.push(cat)
  }
  console.log('✅ Categories:', categories.length)

  const services = [
    { serviceId: 'SVC001', categoryId: categories[0].id, name: 'Balayage',      price: 140, duration: 150, colour: '#C9A84C', bg: '#FBF8F0' },
    { serviceId: 'SVC002', categoryId: categories[0].id, name: 'Full Colour',    price: 95,  duration: 90,  colour: '#C9A84C', bg: '#FBF8F0' },
    { serviceId: 'SVC003', categoryId: categories[1].id, name: 'Cut & Blowdry', price: 55,  duration: 60,  colour: '#3D5A80', bg: '#E8F0F8' },
    { serviceId: 'SVC004', categoryId: categories[1].id, name: 'Dry Trim',      price: 30,  duration: 30,  colour: '#3D5A80', bg: '#E8F0F8' },
    { serviceId: 'SVC005', categoryId: categories[2].id, name: 'Russian Lashes', price: 85, duration: 120, colour: '#7B9E87', bg: '#EAF3DE' },
    { serviceId: 'SVC006', categoryId: categories[3].id, name: 'Shellac Mani',  price: 42,  duration: 60,  colour: '#C9895A', bg: '#FEF3E2' },
  ]
  for (const s of services) {
    await prisma.service.upsert({
      where:  { serviceId: s.serviceId },
      update: {},
      create: {
        serviceId:         s.serviceId,
        siteId:            site.id,
        categoryId:        s.categoryId,
        name:              s.name,
        department:        'Main',
        price:             s.price,
        duration:          s.duration,
        depositRequired:   s.price >= 80,
        appointmentColour: s.colour,
        backgroundColour:  s.bg,
        status:            'ACTIVE',
      },
    })
  }
  console.log('✅ Services:', services.length)

  const clients = [
    { customerId: 'C00001', firstName: 'Sarah',   lastName: 'Mitchell',  email: 'sarah.m@example.com',  phoneMobile: '+44 7700 100001' },
    { customerId: 'C00002', firstName: 'Rebecca', lastName: 'Okafor',    email: 'rebecca.o@example.com', phoneMobile: '+44 7700 100002' },
    { customerId: 'C00003', firstName: 'Jade',    lastName: 'Thompson',  email: 'jade.t@example.com',   phoneMobile: '+44 7700 100003' },
    { customerId: 'C00004', firstName: 'Hannah',  lastName: 'Brooks',    email: 'hannah.b@example.com', phoneMobile: '+44 7700 100004' },
    { customerId: 'C00005', firstName: 'Grace',   lastName: 'Obi',       email: 'grace.o@example.com',  phoneMobile: '+44 7700 100005' },
  ]
  for (const c of clients) {
    await prisma.customer.upsert({
      where:  { customerId: c.customerId },
      update: {},
      create: { ...c, siteId: site.id, isNew: false, reminderType: 'SMS' },
    })
  }
  console.log('✅ Clients:', clients.length)


  // ── Appointments ────────────────────────────────────────────────
  const today = new Date()
  today.setHours(12, 0, 0, 0) // noon local to avoid UTC boundary issues

  const allSpecialists = await prisma.specialist.findMany({ where: { siteId: site.id } })
  const allCustomers   = await prisma.customer.findMany({ where: { siteId: site.id } })
  const allServices    = await prisma.service.findMany({ where: { siteId: site.id } })

  const sp = (id: string) => allSpecialists.find(s => s.staffId === id)!
  const cu = (id: string) => allCustomers.find(c => c.customerId === id)!
  const sv = (id: string) => allServices.find(s => s.serviceId === id)!

  const apptSeeds = [
    { custId: 'C00001', specId: 'ST00001', svcId: 'SVC001', start: '09:00', end: '11:30', status: 'CONFIRMED' },
    { custId: 'C00002', specId: 'ST00001', svcId: 'SVC002', start: '12:00', end: '13:00', status: 'CONFIRMED'   },
    { custId: 'C00003', specId: 'ST00002', svcId: 'SVC003', start: '09:30', end: '10:30', status: 'CONFIRMED'   },
    { custId: 'C00004', specId: 'ST00002', svcId: 'SVC004', start: '11:00', end: '11:45', status: 'UNCONFIRMED' },
    { custId: 'C00005', specId: 'ST00003', svcId: 'SVC001', start: '10:00', end: '12:30', status: 'CONFIRMED'   },
    { custId: 'C00001', specId: 'ST00003', svcId: 'SVC005', start: '14:00', end: '15:30', status: 'CONFIRMED'   },
    { custId: 'C00002', specId: 'ST00004', svcId: 'SVC006', start: '09:00', end: '10:00', status: 'CONFIRMED'   },
    { custId: 'C00003', specId: 'ST00004', svcId: 'SVC003', start: '11:00', end: '13:30', status: 'CONFIRMED'   },
  ]

  // Clear existing appointment data before re-seeding
  await prisma.appointmentService.deleteMany({ where: { appointment: { siteId: site.id } } })
  await prisma.appointment.deleteMany({ where: { siteId: site.id } })

  let apptCount = 0
  for (const a of apptSeeds) {
    const specialist = sp(a.specId)
    const customer   = cu(a.custId)
    const service    = sv(a.svcId)
    if (!specialist || !customer || !service) {
      console.warn(`  ⚠ Skipping appt — missing: spec=${!!specialist} cust=${!!customer} svc=${!!service}`)
      continue
    }

    const appt = await prisma.appointment.create({
      data: {
        siteId:          site.id,
        customerId:      customer.id,
        bookedBy:        'seed',
        appointmentDate: today,
        status:          a.status as any,
        repeat:          'OFF',
        ends:            'NEVER',
      },
    })

    await prisma.appointmentService.create({
      data: {
        appointmentId: appt.id,
        serviceId:     service.id,
        specialistId:  specialist.id,
        startTime:     a.start,
        endTime:       a.end,
        price:         service.price,
        duration:      service.duration,
        isPreferred:   true,
      },
    })
    apptCount++
  }
  console.log(`✅ Appointments: ${apptCount}`)

  console.log('\n🎉 Seed complete!')
  console.log('   Login: owner@purebook.dev / purebook2024!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
