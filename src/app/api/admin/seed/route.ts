import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("🧹 Cleaning database...");
    await prisma.orderItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.sellerProfile.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const products = [
      { name: "Madhubani Painting - Tree of Life", price: 1299, originalPrice: 1799, description: "A beautiful hand-painted Madhubani artwork depicting the sacred Tree of Life, created by skilled artisans from the Mithila region of Bihar.", category: "Mithila Art", vendor: "Mithila Artisans", rating: 4.8, reviews: 124, stock: 15, image: "bg-amber-100 dark:bg-amber-900/30" },
      { name: "Bhagalpuri Silk Saree", price: 3499, originalPrice: 4999, description: "Genuine Bhagalpuri Tussar silk saree with traditional motifs woven by master weavers of Bhagalpur.", category: "Handlooms", vendor: "Bhagalpur Weaves", rating: 4.9, reviews: 89, stock: 8, image: "bg-rose-100 dark:bg-rose-900/30" },
      { name: "Silao Khaja (1 kg)", price: 350, originalPrice: null, description: "Famous crispy sweet delicacy from Silao, Nalanda. Made with refined flour, sugar, and ghee.", category: "Sweets", vendor: "Silao Sweets", rating: 4.6, reviews: 234, stock: 50, image: "bg-yellow-100 dark:bg-yellow-900/30" },
      { name: "Sikki Grass Basket", price: 450, originalPrice: 599, description: "Handwoven basket made from Sikki grass by tribal women artisans.", category: "Handicrafts", vendor: "EcoCrafts Bihar", rating: 4.5, reviews: 67, stock: 20, image: "bg-green-100 dark:bg-green-900/30" },
      { name: "Bihar Spice Box (Set of 6)", price: 599, originalPrice: 799, description: "A curated collection of six premium spices sourced directly from Bihar farms.", category: "Spices", vendor: "Bihar Spice Co.", rating: 4.7, reviews: 156, stock: 30, image: "bg-red-100 dark:bg-red-900/30" },
      { name: "Wooden Carved Elephant", price: 899, originalPrice: null, description: "Intricately hand-carved wooden elephant figurine, a traditional craft from Bihar.", category: "Handicrafts", vendor: "Patna Crafts Hub", rating: 4.4, reviews: 42, stock: 12, image: "bg-orange-100 dark:bg-orange-900/30" },
      { name: "Litti Chokha Ready Mix", price: 199, originalPrice: null, description: "Authentic Litti Chokha ready-to-cook mix. Just add water, shape, and bake!", category: "Spices", vendor: "Bihari Kitchen", rating: 4.3, reviews: 312, stock: 2, image: "bg-amber-100 dark:bg-amber-900/30" },
      { name: "Tilkut - Gaya Special (500g)", price: 250, originalPrice: null, description: "Traditional Tilkut from Gaya, made from sesame seeds and jaggery.", category: "Sweets", vendor: "Gaya Sweet House", rating: 4.7, reviews: 198, stock: 0, image: "bg-yellow-100 dark:bg-yellow-900/30" },
      { name: "Mithila Makhana (1 kg)", price: 699, originalPrice: 899, description: "Premium quality fox nuts (Makhana) sourced directly from Mithila region farms.", category: "Spices", vendor: "Mithila Organics", rating: 4.8, reviews: 276, stock: 40, image: "bg-emerald-100 dark:bg-emerald-900/30" },
      { name: "Madhubani Wall Hanging", price: 1599, originalPrice: 2199, description: "Large Madhubani art wall hanging featuring fish and lotus motifs.", category: "Mithila Art", vendor: "Mithila Artisans", rating: 4.9, reviews: 58, stock: 5, image: "bg-purple-100 dark:bg-purple-900/30" },
      { name: "Katarni Rice (5 kg)", price: 550, originalPrice: null, description: "Aromatic Katarni rice, a GI-tagged variety from Bhagalpur.", category: "Spices", vendor: "Bihar Grains", rating: 4.6, reviews: 143, stock: 35, image: "bg-lime-100 dark:bg-lime-900/30" },
      { name: "Bluetooth Speaker", price: 1499, originalPrice: 2499, description: "Portable Bluetooth speaker with 10-hour battery life, IPX5 water resistance.", category: "Electronics", vendor: "Patna Electronics", rating: 4.2, reviews: 89, stock: 25, image: "bg-blue-100 dark:bg-blue-900/30" },
    ];

    const sampleCustomers = [
      { name: "Rahul Kumar", email: "rahul@example.com", phone: "9876543210" },
      { name: "Priya Singh", email: "priya@example.com", phone: "9876543211" },
      { name: "Amit Verma", email: "amit@example.com", phone: "9876543212" },
      { name: "Sneha Rani", email: "sneha@example.com", phone: "9876543213" },
      { name: "Vikash Jha", email: "vikash@example.com", phone: "9876543214" },
      { name: "Anita Devi", email: "anita@example.com", phone: "9876543215" },
    ];

    const sampleAddresses = [
      { fullName: "Rahul Kumar", phone: "9876543210", street: "Gandhi Maidan Road", city: "Patna", state: "Bihar", pincode: "800001" },
      { fullName: "Priya Singh", phone: "9876543211", street: "Station Road, Danapur", city: "Patna", state: "Bihar", pincode: "801503" },
      { fullName: "Amit Verma", phone: "9876543212", street: "University Road", city: "Muzaffarpur", state: "Bihar", pincode: "842001" },
      { fullName: "Sneha Rani", phone: "9876543213", street: "Kacheri Ghat", city: "Bhagalpur", state: "Bihar", pincode: "812001" },
      { fullName: "Vikash Jha", phone: "9876543214", street: "Main Market, Madhubani", city: "Madhubani", state: "Bihar", pincode: "847211" },
      { fullName: "Anita Devi", phone: "9876543215", street: "Bodh Gaya Road", city: "Gaya", state: "Bihar", pincode: "823001" },
    ];

    const ORDER_STATUSES = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

    // Create seller
    console.log("👤 Creating users...");
    const seller = await prisma.user.create({
      data: {
        email: "seller@biharbazaar.com",
        name: "Bihar Bazaar Seller",
        role: "seller",
        password: hashedPassword,
      },
    });

    // Create admin
    const admin = await prisma.user.create({
      data: {
        email: "admin@biharbazaar.com",
        name: "Admin",
        role: "admin",
        password: hashedPassword,
      },
    });

    // Create a second seller
    const seller2 = await prisma.user.create({
      data: {
        email: "mithila@biharbazaar.com",
        name: "Mithila Artisans",
        role: "seller",
        password: hashedPassword,
      },
    });

    // Create customers
    const customers: any[] = [];
    for (const c of sampleCustomers) {
      const customer = await prisma.user.create({
        data: { ...c, role: "customer", password: hashedPassword },
      });
      customers.push(customer);
    }

    // Seed products
    console.log("🛍️ Creating products...");
    const createdProducts: any[] = [];
    for (const p of products) {
      const prod = await prisma.product.create({
        data: {
          ...p,
          sellerId: p.vendor === "Mithila Artisans" ? seller2.id : seller.id,
          inStock: p.stock > 0,
          status: "active",
        },
      });
      createdProducts.push(prod);
    }

    // Create addresses for customers
    console.log("📍 Creating addresses...");
    const createdAddresses: any[] = [];
    for (let i = 0; i < customers.length; i++) {
      const addr = await prisma.address.create({
        data: { ...sampleAddresses[i], userId: customers[i].id },
      });
      createdAddresses.push(addr);
    }

    // Create sample orders across different months
    console.log("📦 Creating orders...");
    const now = new Date();
    const orderData = [
      // Recent orders (this month)
      { customerIdx: 0, productIdxs: [0, 4], status: "confirmed", daysAgo: 1, paymentMode: "online" },
      { customerIdx: 1, productIdxs: [1], status: "packed", daysAgo: 2, paymentMode: "cod" },
      { customerIdx: 2, productIdxs: [2, 7], status: "shipped", daysAgo: 3, paymentMode: "online" },
      { customerIdx: 3, productIdxs: [9, 3], status: "out_for_delivery", daysAgo: 4, paymentMode: "cod" },
      { customerIdx: 4, productIdxs: [8], status: "delivered", daysAgo: 5, paymentMode: "online" },
      // Last month
      { customerIdx: 5, productIdxs: [11, 6], status: "delivered", daysAgo: 35, paymentMode: "online" },
      { customerIdx: 0, productIdxs: [5], status: "delivered", daysAgo: 40, paymentMode: "cod" },
      { customerIdx: 1, productIdxs: [10, 4], status: "delivered", daysAgo: 42, paymentMode: "online" },
      // 2 months ago
      { customerIdx: 2, productIdxs: [0, 1], status: "delivered", daysAgo: 65, paymentMode: "cod" },
      { customerIdx: 3, productIdxs: [3, 8, 6], status: "delivered", daysAgo: 70, paymentMode: "online" },
      { customerIdx: 4, productIdxs: [9], status: "delivered", daysAgo: 75, paymentMode: "online" },
      // 3 months ago
      { customerIdx: 5, productIdxs: [2, 7], status: "delivered", daysAgo: 95, paymentMode: "cod" },
      { customerIdx: 0, productIdxs: [11], status: "delivered", daysAgo: 100, paymentMode: "online" },
      // 4 months ago
      { customerIdx: 1, productIdxs: [0], status: "delivered", daysAgo: 125, paymentMode: "online" },
      { customerIdx: 2, productIdxs: [4, 5], status: "delivered", daysAgo: 130, paymentMode: "cod" },
      // 5 months ago
      { customerIdx: 3, productIdxs: [8, 10], status: "delivered", daysAgo: 155, paymentMode: "online" },
      { customerIdx: 4, productIdxs: [1], status: "delivered", daysAgo: 160, paymentMode: "cod" },
    ];

    for (const od of orderData) {
      const customer = customers[od.customerIdx];
      const address = createdAddresses[od.customerIdx];
      const orderProducts = od.productIdxs.map((i) => createdProducts[i]);

      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - od.daysAgo);

      const total = orderProducts.reduce((sum, p) => sum + p.price, 0);

      const timestamps: Record<string, Date> = {};
      const statusIdx = ORDER_STATUSES.indexOf(od.status);
      if (statusIdx >= 1) timestamps.packedAt = new Date(orderDate.getTime() + 86400000);
      if (statusIdx >= 2) timestamps.shippedAt = new Date(orderDate.getTime() + 86400000 * 2);
      if (statusIdx >= 3) timestamps.outForDeliveryAt = new Date(orderDate.getTime() + 86400000 * 3);
      if (statusIdx >= 4) timestamps.deliveredAt = new Date(orderDate.getTime() + 86400000 * 4);

      await prisma.order.create({
        data: {
          userId: customer.id,
          addressId: address.id,
          total,
          status: od.status,
          paymentMode: od.paymentMode,
          createdAt: orderDate,
          ...timestamps,
          items: {
            create: orderProducts.map((p) => ({
              productId: p.id,
              quantity: 1,
              price: p.price,
            })),
          },
        },
      });
    }

    // Create some reviews
    console.log("⭐ Creating reviews...");
    const reviewData = [
      { customerIdx: 0, productIdx: 0, rating: 5, text: "Absolutely beautiful Madhubani painting! The colors are vibrant and the details are stunning.", title: "Stunning artwork!" },
      { customerIdx: 1, productIdx: 1, rating: 5, text: "The silk quality is exceptional. Authentic Bhagalpuri craftsmanship.", title: "Best silk saree ever" },
      { customerIdx: 2, productIdx: 2, rating: 4, text: "Crispy and delicious khaja. Reminds me of home. Packaging could be better.", title: "Taste of home" },
      { customerIdx: 3, productIdx: 8, rating: 5, text: "Premium quality makhana. Big and crunchy. Will order again!", title: "Excellent quality" },
      { customerIdx: 4, productIdx: 4, rating: 4, text: "Great spice collection but the packaging arrived slightly damaged.", title: "Good product, average packaging" },
      { customerIdx: 5, productIdx: 9, rating: 5, text: "This wall hanging is a masterpiece. Everyone asks about it.", title: "A true work of art" },
    ];

    for (const r of reviewData) {
      await prisma.review.create({
        data: {
          productId: createdProducts[r.productIdx].id,
          userId: customers[r.customerIdx].id,
          userName: sampleCustomers[r.customerIdx].name,
          rating: r.rating,
          body: r.text,
          title: r.title,
          verified: true,
          helpful: Math.floor(Math.random() * 25),
        },
      });
    }

    return NextResponse.json({
      message: "✅ Seed complete!",
      products: products.length,
      users: customers.length + 3,
      orders: orderData.length,
      reviews: reviewData.length
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
