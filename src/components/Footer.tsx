import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-slate-900 text-slate-400 overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛕</span>
              <span className="font-black text-xl text-white tracking-tight">Bihar Bazaar</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 opacity-70">
              Empowering local sellers and delivering the best of Bihar to your doorstep. From Madhubani art to Bhagalpuri silk — discover authentic treasures.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Twitter", icon: "𝕏" },
                { label: "Instagram", icon: "◉" },
                { label: "Facebook", icon: "f" },
                { label: "YouTube", icon: "▶" },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  suppressHydrationWarning
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-sm hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/seller", label: "Sell on Bihar Bazaar" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm hover:text-white hover:pl-1 transition-all duration-200 text-left"
                >
                  {link.label}
                </Link>
              ))}
              {["About Us", "Contact", "FAQs"].map((label) => (
                <button
                  key={label}
                  type="button"
                  suppressHydrationWarning
                  className="text-sm hover:text-white hover:pl-1 transition-all duration-200 text-left"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <nav className="flex flex-col gap-3">
              {["Mithila Art", "Handlooms & Silk", "Spices & Food", "Sweets & Snacks", "Handicrafts", "Electronics"].map((cat) => (
                <Link key={cat} href="/shop" className="text-sm hover:text-white hover:pl-1 transition-all duration-200">
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
            <nav className="flex flex-col gap-3">
              {["Help Center", "Privacy Policy", "Terms of Service", "Refund Policy", "Shipping Info"].map((item) => (
                <button key={item} type="button" suppressHydrationWarning className="text-sm hover:text-white hover:pl-1 transition-all duration-200 text-left">
                  {item}
                </button>
              ))}
              <Link href="/admin/login" className="text-sm text-primary/60 hover:text-primary transition-all duration-200 text-left mt-2 flex items-center gap-1.5">
                <span>🔐</span> Admin Portal
              </Link>
            </nav>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-bold text-white mb-1">📞 Need Help?</div>
              <div className="text-xs opacity-70">support@biharbazaar.com</div>
              <div className="text-xs opacity-70">+91 612 XXX XXXX</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50" suppressHydrationWarning>
            © {new Date().getFullYear()} Bihar Bazaar. All rights reserved. Made with ❤️ in Bihar.
          </p>
          <div className="flex items-center gap-3 text-xs opacity-40">
            {["💳 UPI", "💳 VISA", "💳 Mastercard", "🏦 Net Banking"].map((m) => (
              <span key={m} className="border border-white/10 rounded px-2 py-1">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
