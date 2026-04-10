import React from 'react';

const categories = [
  { name: 'Mithila Art', icon: '🎨', color: 'bg-red-50 dark:bg-red-950/30' },
  { name: 'Handlooms', icon: '🧵', color: 'bg-orange-50 dark:bg-orange-950/30' },
  { name: 'Spices', icon: '🌶️', color: 'bg-green-50 dark:bg-green-950/30' },
  { name: 'Sweets', icon: '🍬', color: 'bg-yellow-50 dark:bg-yellow-950/30' },
  { name: 'Handicrafts', icon: '🏺', color: 'bg-amber-50 dark:bg-amber-950/30' },
  { name: 'Electronics', icon: '📱', color: 'bg-blue-50 dark:bg-blue-950/30' },
];

export default function Categories() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-black/60 dark:text-white/60 mt-2">Discover authentic local products</p>
        </div>
        <button className="text-primary font-medium hover:underline">View All</button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div 
            key={category.name} 
            className={`${category.color} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03] transition-transform border border-black/5 dark:border-white/5 opacity-90 hover:opacity-100 flex-1`}
          >
            <span className="text-3xl">{category.icon}</span>
            <span className="font-semibold text-sm text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
