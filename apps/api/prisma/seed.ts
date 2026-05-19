import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { Category, Prisma, PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/shop_dev'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const ADMIN_EMAIL = 'admin@kramnik.local'
const CUSTOMER_EMAIL = 'customer@kramnik.local'
const ADMIN_PASSWORD = 'Admin123!'
const CUSTOMER_PASSWORD = 'Customer123!'

type ProductSeed = {
  name: string
  slug: string
  description: string
  price: string
  category: Category
}

const products: ProductSeed[] = [
  {
    name: 'Cardboard Room Divider',
    slug: 'cardboard-room-divider',
    description:
      'Defines spaces without commitment. May sag in humidity. Formerly a shipping box.',
    price: '24.99',
    category: Category.HOME,
  },
  {
    name: 'Mystery Junk Drawer',
    slug: 'mystery-junk-drawer',
    description:
      'Pre-filled with batteries (dead), cables (unknown), and one key to nothing.',
    price: '19.50',
    category: Category.HOME,
  },
  {
    name: 'Overused Welcome Mat',
    slug: 'overused-welcome-mat',
    description: 'Says WELCOME in a font that gave up. Authentic foot traffic patina.',
    price: '12.00',
    category: Category.HOME,
  },
  {
    name: 'Premium Landfill Starter Kit',
    slug: 'premium-landfill-starter-kit',
    description:
      'Everything you need to disappoint the environment in style. Bags not included.',
    price: '8.88',
    category: Category.GARBAGE,
  },
  {
    name: 'Bag of Slightly Off Smells',
    slug: 'bag-of-slightly-off-smells',
    description: 'Curated aromas from unknown origins. Not returnable. Obviously.',
    price: '6.66',
    category: Category.GARBAGE,
  },
  {
    name: 'Certified Trash Aura Spray',
    slug: 'certified-trash-aura-spray',
    description: 'Makes any room feel like a back alley. Notes of damp cardboard.',
    price: '11.11',
    category: Category.GARBAGE,
  },
  {
    name: 'Box of Mismatched Screws',
    slug: 'box-of-mismatched-screws',
    description: 'None fit anything you own. Guaranteed. Still somehow useful once.',
    price: '4.20',
    category: Category.SCRAPS,
  },
  {
    name: 'Rust Flakes (Artisanal)',
    slug: 'rust-flakes-artisanal',
    description: 'Hand-corroded iron shavings for crafts, rituals, or filing complaints.',
    price: '9.99',
    category: Category.SCRAPS,
  },
  {
    name: 'Single Left Sock (Vintage)',
    slug: 'single-left-sock-vintage',
    description: 'Partner lost to the dryer in 2019. Holds memories and mild despair.',
    price: '3.50',
    category: Category.SCRAPS,
  },
  {
    name: 'Gnome With Existential Dread',
    slug: 'gnome-existential-dread',
    description:
      'Stares into the middle distance. Perfect for gardens that question meaning.',
    price: '34.99',
    category: Category.GARDEN_GNOMES,
  },
  {
    name: 'Mossy Gnome (Pre-Weathered)',
    slug: 'mossy-gnome-pre-weathered',
    description: 'Arrives already judging your lawn care. Moss may be paint.',
    price: '29.00',
    category: Category.GARDEN_GNOMES,
  },
  {
    name: 'Gnome Hat Only (Gnome Not Included)',
    slug: 'gnome-hat-only',
    description: 'For DIY enthusiasts and gnome witness protection programs.',
    price: '7.77',
    category: Category.GARDEN_GNOMES,
  },
]

function imageUrlForSlug(slug: string): string {
  return `https://picsum.photos/seed/kramnik-${slug}/400/300`
}

async function seedUsers(): Promise<void> {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const customerHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10)

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash: adminHash, role: Role.ADMIN },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: { passwordHash: customerHash, role: Role.CUSTOMER },
    create: {
      email: CUSTOMER_EMAIL,
      passwordHash: customerHash,
      role: Role.CUSTOMER,
    },
  })
}

async function seedProducts(): Promise<void> {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: new Prisma.Decimal(product.price),
        imageUrl: imageUrlForSlug(product.slug),
        category: product.category,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: new Prisma.Decimal(product.price),
        imageUrl: imageUrlForSlug(product.slug),
        category: product.category,
      },
    })
  }
}

async function main(): Promise<void> {
  await seedUsers()
  await seedProducts()
  console.log(
    `Seeded ${products.length} products and 2 users (${ADMIN_EMAIL}, ${CUSTOMER_EMAIL}).`,
  )
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
