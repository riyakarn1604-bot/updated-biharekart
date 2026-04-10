import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-bold text-2xl tracking-tighter text-primary mb-4">Bihar eKart</div>
          <p className="text-sm text-black/60 dark:text-white/60 max-w-xs">
            Empowering local sellers and delivering the best of Bihar to your doorstep.
          </p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold mb-2">Platform</h4>
            <a href="#" className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">About Us</a>
            <a href="#" className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Contact</a>
            <a href="#" className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">FAQs</a>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold mb-2">Legal</h4>
            <a href="#" className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 dark:border-white/5 py-6 text-center text-sm text-black/40 dark:text-white/40">
        © {new Date().getFullYear()} Bihar eKart. All rights reserved.
      </div>
    </footer>
  );
}
