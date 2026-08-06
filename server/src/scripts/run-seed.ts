import { Category } from "../models/category.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import { categories, products, suppliers } from "./seed-data.js"

const SEED_SUPPLIER_PASSWORD = "Supplier123!"

export const DEMO_BUYER_EMAIL = "demo.buyer@veyra.dev"
export const DEMO_BUYER_PASSWORD = "DemoBuyer123!"

/**
 * Wipes and reloads the demo catalog. Assumes the caller already holds a
 * live Mongo connection (via connectDB()) and will manage disconnecting —
 * this function only touches collections.
 */
export async function runSeed() {
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({ email: { $in: [...suppliers.map((s) => s.email), DEMO_BUYER_EMAIL] } }),
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

  await User.create({
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

  for (const { categoryKey, supplierKey, createdAt, ...product } of products) {
    await Product.create({
      ...product,
      category: categoryKey,
      supplier: supplierIdByKey.get(supplierKey),
      createdAt: new Date(createdAt),
    })
  }
  console.log(`Seeded ${products.length} products`)
}
