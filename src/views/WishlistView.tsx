import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, navigateTo } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Curated Wishlist
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#16130f] font-medium mb-3">
          Saved Fragrances
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          Fragrances you have bookmarked for contemplation or special gifting.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white border border-[#eee8da] p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#16130f] mb-2">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#6f695f] font-sans mb-6">
            Explore our artisanal collection and click the heart icon on any creation you love.
          </p>
          <button
            onClick={() => navigateTo({ name: 'shop' })}
            className="bg-[#16130f] hover:bg-[#b8985f] text-white px-7 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer"
          >
            Explore Fragrances
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
