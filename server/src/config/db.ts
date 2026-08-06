import dns from "node:dns"
import mongoose from "mongoose"

import { env } from "./env.js"

function maskMongoUri(uri: string) {
  return uri.replace(/\/\/([^:/@]+):([^@]+)@/, "//$1:****@")
}

function isSrvDnsFailure(error: unknown): boolean {
  return (
    env.MONGODB_URI.startsWith("mongodb+srv://") &&
    error instanceof Error &&
    /querySrv|ECONNREFUSED/i.test(error.message)
  )
}

export async function connectDB() {
  mongoose.set("strictQuery", true)

  console.log("Connecting to MongoDB:", maskMongoUri(env.MONGODB_URI))

  try {
    await mongoose.connect(env.MONGODB_URI)
  } catch (error) {
    if (!isSrvDnsFailure(error)) {
      console.error("MongoDB connection failed:", error)
      process.exit(1)
    }

    // Known Node.js regression on Windows (Node >=24.13.0, still present in
    // 25.x/26.x as of early 2026): c-ares misidentifies its own loopback-DNS
    // fallback, so dns.resolveSrv() throws ECONNREFUSED before any MongoDB
    // code runs — this is why tools like Compass (which don't go through
    // Node's c-ares resolver) connect fine with the identical URI while a
    // Node app fails. Confirmed via nodejs/node#61435, #61448, #62326.
    // Fix: point Node at real DNS resolvers instead of the broken fallback,
    // then retry once.
    console.warn(
      "MongoDB SRV DNS lookup failed via the system resolver — this matches a known " +
        "Node.js Windows regression (see nodejs/node#61435). Retrying with explicit DNS servers...",
    )
    dns.setServers(["1.1.1.1", "8.8.8.8"])

    try {
      await mongoose.connect(env.MONGODB_URI)
    } catch (retryError) {
      console.error("MongoDB connection failed after DNS fallback:", retryError)
      process.exit(1)
    }
  }

  console.log("MongoDB connected")
}
