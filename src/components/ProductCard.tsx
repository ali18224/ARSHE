import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const price = product.basePrice;
  const sale = product.salePrice;
  const effectivePrice = sale && sale > 0 && sale < price ? sale : price;
  const discountPercent = sale && sale < price ? Math.round(((price - sale) / price) * 100) : 0;
  const wishlisted = isWishlisted(product.id);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleCardClick = () => {
    navigateTo({ name: 'product', slug: product.slug });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0]?.id || null;
    addToCart(product, defaultSize, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#eee8da] hover:border-[#b8985f]/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 4:5 aspect ratio */}
      <div
        onClick={handleCardClick}
        className="relative aspect-[4/5] bg-[#f4eee3] overflow-hidden cursor-pointer"
      >
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Minimalist status badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 ? (
            <span className="bg-[#16130f] text-[#fbf9f4] text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              -{discountPercent}%
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-[#b8985f] text-white text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              New
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-[#16130f] text-[#c9ad78] text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              Best Seller
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#16130f] flex items-center justify-center shadow-sm transition-all duration-200 z-10 cursor-pointer"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#b8985f] text-[#b8985f]' : 'text-[#16130f]'
            }`}
          />
        </button>

        {/* Hover Action Strip (Desktop hover / Mobile tap friendly) */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex-1 bg-[#16130f] hover:bg-[#b8985f] text-[#fbf9f4] py-2 px-3 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock <= 0 ? 'Out of Stock' : 'Quick Add'}</span>
          </button>
          <button
            onClick={handleQuickView}
            className="w-9 h-9 bg-white/95 hover:bg-[#16130f] hover:text-white text-[#16130f] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Quick preview"
            title="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between" onClick={handleCardClick}>
        <div>
          {/* Unboxed metadata line with subtle separators */}
          <div className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#6f695f] mb-1 font-sans">
            <span className="text-[#b8985f] font-medium">{product.fragranceFamily}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender === 'men' ? 'For Him' : product.gender === 'women' ? 'For Her' : 'Unisex'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-[#16130f] font-medium group-hover:text-[#b8985f] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Short note snippet */}
          <p className="text-xs text-[#6f695f] line-clamp-1 font-sans mb-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Price and reviews row */}
        <div className="pt-2 border-t border-[#eee8da] flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-semibold text-[#16130f]">
              Rs. {effectivePrice.toLocaleString('en-PK')}
            </span>
            {sale && sale < price && (
              <span className="text-xs text-[#a39c91] line-through">
                Rs. {price.toLocaleString('en-PK')}
              </span>
            )}
          </div>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-[#6f695f] font-sans">
              <Star className="w-3 h-3 fill-[#b8985f] text-[#b8985f]" />
              <span className="font-medium text-[#16130f]">{product.rating.toFixed(1)}</span>
              <span className="text-[#a39c91]">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
