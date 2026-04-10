const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
  { name: "Madhubani Painting - Tree of Life", price: 1299, originalPrice: 1799, description: "A beautiful hand-painted Madhubani artwork depicting the sacred Tree of Life.", category: "Mithila Art", vendor: "Mithila Artisans", rating: 4.8, reviews: 124, stock: 15, image: "bg-amber-100 dark:bg-amber-900/30" },
  { name: "Bhagalpuri Silk Saree", price: 3499, originalPrice: 4999, description: "Genuine Bhagalpuri Tussar silk saree with traditional motifs.", category: "Handlooms", vendor: "Bhagalpur Weaves", rating: 4.9, reviews: 89, stock: 8, image: "bg-rose-100 dark:bg-rose-900/30" },
  { name: "Silao Khaja (1 kg)", price: 350, originalPrice: null, description: "Famous crispy sweet delicacy from Silao, Nalanda.", category: "Sweets", vendor: "Silao Sweets", rating: 4.6, reviews: 234, stock: 50, image: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Sikki Grass Basket", price: 450, originalPrice: 599, description: "Handwoven basket made from Sikki grass by tribal women artisans.", category: "Handicrafts", vendor: "EcoCrafts Bihar", rating: 4.5, reviews: 67, stock: 20, image: "bg-green-100 dark:bg-green-900/30" },
  { name: "Bihar Spice Box (Set of 6)", price: 599, originalPrice: 799, description: "A curated collection of six premium spices from Bihar farms.", category: "Spices", vendor: "Bihar Spice Co.", rating: 4.7, reviews: 156, stock: 30, image: "bg-red-100 dark:bg-red-900/30" },
  { name: "Wooden Carved Elephant", price: 899, originalPrice: null, description: "Hand-carved wooden elephant figurine from Bihar.", category: "Handicrafts", vendor: "Patna Crafts Hub", rating: 4.4, reviews: 42, stock: 12, image: "bg-orange-100 dark:bg-orange-900/30" },
  { name: "Litti Chokha Ready Mix", price: 199, originalPrice: null, description: "Authentic Litti Chokha ready-to-cook mix.", category: "Spices", vendor: "Bihari Kitchen", rating: 4.3, reviews: 312, stock: 100, image: "bg-amber-100 dark:bg-amber-900/30" },
  { name: "Tilkut - Gaya Special (500g)", price: 250, originalPrice: null, description: "Traditional Tilkut from Gaya.", category: "Sweets", vendor: "Gaya Sweet House", rating: 4.7, reviews: 198, stock: 60, image: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Mithila Makhana (1 kg)", price: 699, originalPrice: 899, description: "Premium fox nuts from Mithila region.", category: "Spices", vendor: "Mithila Organics", rating: 4.8, reviews: 276, stock: 40, image: "bg-emerald-100 dark:bg-emerald-900/30" },
  { name: "Madhubani Wall Hanging", price: 1599, originalPrice: 2199, description: "Large Madhubani art wall hanging.", category: "Mithila Art", vendor: "Mithila Artisans", rating: 4.9, reviews: 58, stock: 10, image: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Katarni Rice (5 kg)", price: 550, originalPrice: null, description: "Aromatic Katarni rice from Bhagalpur.", category: "Spices", vendor: "Bihar Grains", rating: 4.6, reviews: 143, stock: 35, image: "bg-lime-100 dark:bg-lime-900/30" },
  { name: "Bluetooth Speaker", price: 1499, originalPrice: 2499, description: "Portable Bluetooth speaker with 10-hour battery.", category: "Electronics", vendor: "Patna Electronics", rating: 4.2, reviews: 89, stock: 25, image: "bg-blue-100 dark:bg-blue-900/30" },
];

async function main() {
  const seller = await prisma.user.upsert({
    where: { email: "seller@biharekart.com" },
    update: {},
    create: { email: "seller@biharekart.com", name: "Bihar eKart Seller", role: "seller", password: "$2a$10$K7lXfKoO3KxMrDpY6PDKCOqX0oQrVv3sUBxoRM.qSqYlm.H/SCCMy" },
  });
  console.log("Seller created:", seller.id);

  await prisma.user.upsert({
    where: { email: "admin@biharekart.com" },
    update: {},
    create: { email: "admin@biharekart.com", name: "Admin", role: "admin", password: "$2a$10$K7lXfKoO3KxMrDpY6PDKCOqX0oQrVv3sUBxoRM.qSqYlm.H/SCCMy" },
  });
  console.log("Admin created");

  for (const p of products) {
    await prisma.product.create({ data: { ...p, sellerId: seller.id, inStock: true, status: "active" } });
    console.log("  +", p.name);
  }
  console.log("Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
