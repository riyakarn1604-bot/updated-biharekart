const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

console.log("DB URL:", process.env.DATABASE_URL);

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

prisma.user.count()
  .then(c => console.log("Users count:", c))
  .catch(e => console.log("Error:", e.message))
  .finally(() => prisma.$disconnect());
