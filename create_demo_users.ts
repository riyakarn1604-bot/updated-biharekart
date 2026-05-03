import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const dbUrl = "file:dev.db";
const libsql = createClient({ url: dbUrl });
// @ts-expect-error type mismatch between libsql client and prisma adapter
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Creating presentation accounts...");
  
  const accounts = [
    { email: "admin@demo.com", name: "Demo Admin", role: "admin", pass: "admin123" },
    { email: "seller@demo.com", name: "Demo Seller", role: "seller", pass: "seller123" },
    { email: "user@demo.com", name: "Demo User", role: "customer", pass: "user123" },
  ];

  for (const acc of accounts) {
    const hashed = await bcrypt.hash(acc.pass, 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: { password: hashed, role: acc.role },
      create: {
        email: acc.email,
        name: acc.name,
        role: acc.role,
        password: hashed,
      },
    });
    console.log(`✅ Created ${acc.role}: ${acc.email} / ${acc.pass}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
