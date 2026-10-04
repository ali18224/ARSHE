import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Star } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, navigateTo } = useStore();

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const sizes = product.sizes;
  const activeSize = sizes.find((s) => s.id === (selectedSizeId ?? sizes[0]?.id)) || sizes[0];

  const price = activeSize ? activeSize.price : product.basePrice;
  const sale = activeSize ? activeSize.salePrice : product.salePrice;
  const effectivePrice = sale && sale > 0 && sale < price ? sale : price;
  const currentStock = activeSize ? activeSize.stock : product.stock;

  const handleAdd = () => {
    addToCart(product, activeSize?.id || null, quantity);
    closeQuickView();
  };

  const handleFullDetails = () => {
    closeQuickView();
    navigateTo({ name: 'product', slug: product.slug });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#fbf9f4] shadow-2xl overflow-hidden z-10 grid md:grid-cols-2 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#16130f] flex items-center justify-center shadow-sm cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-[#f4eee3] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#b8985f] mb-1.5 font-sans">
              <span>{product.fragranceFamily}</span>
              <span>·</span>
              <span>{product.gender}</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-[#16130f] mb-2 font-medium">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-xl font-bold text-[#16130f]">
                  Rs. {effectivePrice.toLocaleString('en-PK')}
                </span>
                {sale && sale < price && (
                  <span className="text-sm text-[#a39c91] line-through">
                    Rs. {price.toLocaleString('en-PK')}
                  </span>
                )}
              </div>

              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#6f695f] font-sans">
                  <Star className="w-3.5 h-3.5 fill-[#b8985f] text-[#b8985f]" />
                  <span className="font-medium text-[#16130f]">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount})</span>
                </div>
              )}
            </div>

            <p className="text-xs text-[#6f695f] leading-relaxed mb-5 font-sans">
              {product.shortDescription}
            </p>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs text-[#16130f] mb-2 font-sans">
                  <span className="uppercase tracking-wider font-medium">Select Flacon Size</span>
                  <span className="text-[#6f695f]">
                    {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s) => {
                    const isSelected = (activeSize?.id === s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSizeId(s.id)}
                        className={`py-2 px-2 text-center border text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#16130f] bg-[#16130f] text-white font-medium'
                            : 'border-[#e4ddcf] bg-white text-[#16130f] hover:border-[#b8985f]'
                        }`}
                      >
                        <div className="font-sans">{s.label.split(' ')[0]}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          Rs. {(s.salePrice || s.price).toLocaleString('en-PK')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fragrance Notes Highlights */}
            <div className="bg-[#f4eee3] p-3 border border-[#eee8da] mb-5 text-[11px] space-y-1 font-sans text-[#6f695f]">
              <p>
                <strong className="text-[#16130f]">Top:</strong> {product.topNotes}
              </p>
              <p>
                <strong className="text-[#16130f]">Heart:</strong> {product.heartNotes}
              </p>
              <p>
                <strong className="text-[#16130f]">Base:</strong> {product.baseNotes}
              </p>
            </div>
          </div>

          <div>
            {/* Quantity and Add Button */}
            <div className="flex gap-3 mb-3">
              <div className="flex items-center border border-[#e4ddcf] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-11 flex items-center justify-center hover:bg-[#f4eee3]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-mono font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="w-9 h-11 flex items-center justify-center hover:bg-[#f4eee3] disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={currentStock <= 0}
                className="flex-1 bg-[#16130f] hover:bg-[#b8985f] text-white text-xs uppercase tracking-[0.18em] font-medium py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentStock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleFullDetails}
              className="w-full text-center text-xs text-[#6f695f] hover:text-[#16130f] underline underline-offset-2 flex items-center justify-center gap-1 cursor-pointer pt-1"
            >
              <span>View complete perfume notes & reviews</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
