import mongoose from "mongoose"

import { app } from "./app.js"
import { connectDB } from "./config/db.js"
import { env } from "./config/env.js"
import { Product } from "./models/product.model.js"
import { runSeed } from "./scripts/run-seed.js"

async function main() {
  await connectDB()

  // Local dev only — never auto-seed a real deployment. A fresh dev
  // database (or one that lost its data) should never leave the app
  // looking broken with an empty marketplace.
  if (env.NODE_ENV === "development" && (await Product.countDocuments()) === 0) {
    console.log("No products found — seeding the development database...")
    await runSeed()
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Veyra API listening on port ${env.PORT}`)
  })

  // A stale process from a previous dev session (e.g. a `tsx watch` instance
  // that survived a terminal close) can leave the port occupied. Fail with a
  // clear diagnostic instead of an unhandled-exception stack trace.
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `\nPort ${env.PORT} is already in use — another process (likely a leftover ` +
          `dev server from a previous run) is still listening on it.\n` +
          `Find and stop it, then retry:\n` +
          (process.platform === "win32"
            ? `  netstat -ano | findstr :${env.PORT}\n  taskkill /PID <pid> /F\n`
            : `  lsof -i :${env.PORT}\n  kill <pid>\n`),
      )
      process.exit(1)
    }
    throw error
  })

  // Render sends SIGTERM on every deploy/restart — without this, in-flight
  // requests get dropped mid-response instead of finishing cleanly.
  function shutdown() {
    server.close(() => {
      mongoose.disconnect().finally(() => process.exit(0))
    })
  }
  process.on("SIGTERM", shutdown)
  process.on("SIGINT", shutdown)
}

main()
