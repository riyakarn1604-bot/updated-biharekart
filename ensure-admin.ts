import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

async function fix() {
  const dbUrl = "file:dev.db";
  const dbFilename = dbUrl.replace(/^file:[/]*/i, "");
  const absPath = path.resolve(process.cwd(), dbFilename);
  const resolvedUrl = "file:" + absPath.replace(/\\/g, "/");
  
  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
  const prisma = new PrismaClient({ adapter } as any);

  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@demo.com" },
      update: {
        password: hashedPassword,
        role: "admin",
      },
      create: {
        email: "admin@demo.com",
        name: "Demo Admin",
        role: "admin",
        password: hashedPassword,
      },
    });
    console.log("✅ Admin account ensured: admin@demo.com / admin123");
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
