import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface CollectionDetailViewProps {
  slug: string;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ slug }) => {
  const { collections, products, navigateTo } = useStore();

  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#16130f] mb-3">Collection Not Found</h1>
        <button
          onClick={() => navigateTo({ name: 'collections' })}
          className="bg-[#16130f] text-white px-6 py-3 text-xs uppercase tracking-wider"
        >
          View All Collections
        </button>
      </div>
    );
  }

  const collectionProducts = products.filter(
    (p) => collection.productIds.includes(p.id) && p.active
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6f695f] mb-6 font-sans">
        <button onClick={() => navigateTo({ name: 'home' })} className="hover:text-[#16130f]">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#a39c91]" />
        <button onClick={() => navigateTo({ name: 'collections' })} className="hover:text-[#16130f]">
          Collections
        </button>
        <ChevronRight className="w-3 h-3 text-[#a39c91]" />
        <span className="text-[#16130f] font-medium">{collection.name}</span>
      </nav>

      {/* Banner */}
      <div className="relative aspect-[21/9] min-h-[220px] max-h-[360px] bg-[#f4eee3] border border-[#eee8da] overflow-hidden mb-12">
        {collection.image && (
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 text-white max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9ad78] font-sans mb-1">
            Curated Chapter
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#eee8da]">
          <span className="text-xs text-[#6f695f] font-sans">
            Showing {collectionProducts.length} fragrances in this series
          </span>
          <button
            onClick={() => navigateTo({ name: 'collections' })}
            className="inline-flex items-center gap-1 text-xs text-[#16130f] hover:text-[#b8985f] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </button>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#eee8da]">
            <p className="font-serif text-xl text-[#16130f] mb-2">No fragrances currently listed</p>
            <button
              onClick={() => navigateTo({ name: 'shop' })}
              className="bg-[#16130f] text-white px-6 py-2.5 text-xs uppercase tracking-wider mt-2"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
