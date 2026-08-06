import "dotenv/config"
import mongoose from "mongoose"

import { connectDB } from "../config/db.js"
import { runSeed } from "./run-seed.js"

async function seed() {
  await connectDB()
  await runSeed()
  await mongoose.disconnect()
  console.log("Done")
}

seed().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
