import { Category } from "../models/category.model.js"
import { Order, type OrderItem, type OrderStatus } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import { categories, products, suppliers } from "./seed-data.js"

const SEED_SUPPLIER_PASSWORD = "Supplier123!"

export const DEMO_BUYER_EMAIL = "demo.buyer@veyra.dev"
export const DEMO_BUYER_PASSWORD = "DemoBuyer123!"

// The first seeded supplier (Anantara Textile Mills) doubles as the "demo
// supplier" login — same account, just called out by name so judges have a
// credential to sign in with instead of picking one of the seven at random.
export const DEMO_SUPPLIER_EMAIL = suppliers[0].email
export const DEMO_SUPPLIER_PASSWORD = SEED_SUPPLIER_PASSWORD

interface DemoOrderSeed {
  productSlug: string
  quantityMultiplier: number
  status: OrderStatus
  daysAgo: number
}

const demoOrders: DemoOrderSeed[] = [
  { productSlug: "combed-cotton-poplin-ivory", quantityMultiplier: 2, status: "completed", daysAgo: 34 },
  { productSlug: "raw-selvedge-denim-indigo", quantityMultiplier: 1, status: "completed", daysAgo: 21 },
  { productSlug: "mulberry-silk-charmeuse-navy", quantityMultiplier: 1, status: "ready-for-dispatch", daysAgo: 9 },
  { productSlug: "organic-cotton-canvas-charcoal", quantityMultiplier: 3, status: "preparing", daysAgo: 5 },
  { productSlug: "stretch-denim-indigo-light", quantityMultiplier: 1, status: "pending", daysAgo: 1 },
]

const demoShippingAddress = {
  fullName: "Demo Buyer",
  phone: "+1 415 555 0136",
  addressLine1: "480 Folsom Street, Suite 300",
  city: "San Francisco",
  state: "CA",
  postalCode: "94105",
  country: "United States",
}

/**
 * Wipes and reloads the demo catalog. Assumes the caller already holds a
 * live Mongo connection (via connectDB()) and will manage disconnecting —
 * this function only touches collections.
 */
export async function runSeed() {
  const demoBuyer = await User.findOne({ email: DEMO_BUYER_EMAIL })
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({ email: { $in: [...suppliers.map((s) => s.email), DEMO_BUYER_EMAIL] } }),
    ...(demoBuyer ? [Order.deleteMany({ buyer: demoBuyer._id })] : []),
  ])

  await Category.insertMany(categories)
  console.log(`Seeded ${categories.length} categories`)

  const supplierIdByKey = new Map<string, string>()
  for (const supplier of suppliers) {
    const user = await User.create({
      name: supplier.name,
      email: supplier.email,
      password: SEED_SUPPLIER_PASSWORD,
      role: "supplier",
      onboardingCompleted: true,
      supplierProfile: {
        businessName: supplier.name,
        description: supplier.description,
        phone: supplier.phone,
        addressLine1: supplier.addressLine1,
        city: supplier.city,
        state: supplier.state,
        postalCode: supplier.postalCode,
        country: supplier.country,
        operatingHours: supplier.operatingHours,
        categories: supplier.categories,
        defaultMoq: supplier.defaultMoq,
        verified: supplier.verified,
        yearsInBusiness: supplier.yearsInBusiness,
        responseTime: supplier.responseTime,
        certifications: supplier.certifications,
        rating: supplier.rating,
      },
    })
    supplierIdByKey.set(supplier.key, String(user._id))
  }
  console.log(
    `Seeded ${suppliers.length} supplier accounts (password: ${SEED_SUPPLIER_PASSWORD})`,
  )

  const demoBuyerUser = await User.create({
    name: "Demo Buyer",
    email: DEMO_BUYER_EMAIL,
    password: DEMO_BUYER_PASSWORD,
    role: "buyer",
    onboardingCompleted: true,
    buyerProfile: {
      businessType: "Apparel brand",
      industry: "Fashion & apparel",
      interests: ["cotton", "denim", "sustainable"],
      preferredFabrics: ["Cotton Poplin", "Selvedge Denim"],
      budgetRange: "$5-25/m",
      moqPreference: "Under 200 units",
    },
  })
  console.log(`Seeded demo buyer account (${DEMO_BUYER_EMAIL} / ${DEMO_BUYER_PASSWORD})`)
  console.log(`Demo supplier login: ${DEMO_SUPPLIER_EMAIL} / ${DEMO_SUPPLIER_PASSWORD}`)

  const productBySlug = new Map<string, (typeof products)[number]>()
  const productIdBySlug = new Map<string, string>()
  for (const { categoryKey, supplierKey, createdAt, ...product } of products) {
    const created = await Product.create({
      ...product,
      category: categoryKey,
      supplier: supplierIdByKey.get(supplierKey),
      createdAt: new Date(createdAt),
    })
    productBySlug.set(product.slug, { categoryKey, supplierKey, createdAt, ...product })
    productIdBySlug.set(product.slug, String(created._id))
  }
  console.log(`Seeded ${products.length} products`)

  // Order history for the demo buyer — spans multiple suppliers and every
  // status so both the buyer dashboard and each seeded supplier's dashboard
  // have something real to show instead of an empty state on first login.
  for (const seed of demoOrders) {
    const product = productBySlug.get(seed.productSlug)
    const productId = productIdBySlug.get(seed.productSlug)
    if (!product || !productId) continue

    const quantity = product.moq * seed.quantityMultiplier
    const subtotal = Math.round(product.pricePerUnit * quantity * 100) / 100
    const item: OrderItem = {
      productId,
      slug: product.slug,
      name: product.name,
      fabricType: product.fabricType,
      color: product.color,
      colorHex: product.colorHex,
      supplierId: supplierIdByKey.get(product.supplierKey)!,
      supplierName: suppliers.find((s) => s.key === product.supplierKey)!.name,
      pricePerUnit: product.pricePerUnit,
      unit: product.unit,
      quantity,
      subtotal,
    }

    const createdAt = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000)
    await Order.create({
      buyer: demoBuyerUser._id,
      items: [item],
      shipping: demoShippingAddress,
      subtotal,
      total: subtotal,
      status: seed.status,
      createdAt,
    })
  }
  console.log(`Seeded ${demoOrders.length} demo orders`)
}
