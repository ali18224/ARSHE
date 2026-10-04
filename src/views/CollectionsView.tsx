import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const { collections, navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Curated Olfactory Chapters
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#16130f] font-medium mb-3">
          Fragrance Collections
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          From ancient Agarwood distillations to radiant daytime accords, explore ARSHÉ through curated compositions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((coll) => (
          <div
            key={coll.id}
            onClick={() => navigateTo({ name: 'collection', slug: coll.slug })}
            className="group bg-white border border-[#eee8da] hover:border-[#b8985f] overflow-hidden cursor-pointer transition-all duration-300"
          >
            <div className="relative aspect-[16/10] bg-[#f4eee3] overflow-hidden">
              {coll.image && (
                <img
                  src={coll.image}
                  alt={coll.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9ad78] font-sans">
                  Collection ({coll.productIds.length} creations)
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium">
                  {coll.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-sans line-clamp-2 pt-1">
                  {coll.description}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white border-b border-white/60 pb-0.5 group-hover:border-white">
                    <span>Enter Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
