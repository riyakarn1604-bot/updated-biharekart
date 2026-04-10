import React from 'react';

const products = [
  { id: 1, name: 'Madhubani Painting - Tree of Life', price: '₹1,299', vendor: 'Mithila Artisans', image: 'bg-zinc-200 dark:bg-zinc-800' },
  { id: 2, name: 'Bhagalpuri Silk Saree', price: '₹3,499', vendor: 'Bhagalpur Weaves', image: 'bg-zinc-200 dark:bg-zinc-800' },
  { id: 3, name: 'Silao Khaja (1 kg)', price: '₹350', vendor: 'Silao Sweets', image: 'bg-zinc-200 dark:bg-zinc-800' },
  { id: 4, name: 'Sikki Grass Basket', price: '₹450', vendor: 'EcoCrafts Bihar', image: 'bg-zinc-200 dark:bg-zinc-800' },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-black/60 dark:text-white/60 mt-2">Handpicked items celebrating our culture</p>
        </div>
        <button className="text-primary font-medium hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer flex flex-col gap-3">
            <div className={`w-full aspect-square rounded-2xl ${product.image} overflow-hidden relative`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>
            <div>
              <div className="text-xs text-black/50 dark:text-white/50 mb-1 font-medium">{product.vendor}</div>
              <h3 className="font-semibold leading-tight text-base mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="font-bold">{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
