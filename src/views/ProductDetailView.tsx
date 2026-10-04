import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  Wind,
  Calendar,
  Sparkles,
  Truck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailViewProps {
  slug: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ slug }) => {
  const {
    products,
    reviews,
    addToCart,
    toggleWishlist,
    isWishlisted,
    addReview,
    navigateTo,
  } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'details' | 'reviews'>('notes');

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#16130f] mb-3">Fragrance Not Found</h1>
        <p className="text-xs text-[#6f695f] mb-6 font-sans">
          The requested perfume creation could not be found or is currently archived.
        </p>
        <button
          onClick={() => navigateTo({ name: 'shop' })}
          className="bg-[#16130f] text-white px-6 py-3 text-xs uppercase tracking-wider hover:bg-[#b8985f] transition-colors"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const sizes = product.sizes;
  const activeSize = sizes.find((s) => s.id === (selectedSizeId ?? sizes[0]?.id)) || sizes[0];

  const price = activeSize ? activeSize.price : product.basePrice;
  const sale = activeSize ? activeSize.salePrice : product.salePrice;
  const effectivePrice = sale && sale > 0 && sale < price ? sale : price;
  const discountPercent = sale && sale < price ? Math.round(((price - sale) / price) * 100) : 0;
  const currentStock = activeSize ? activeSize.stock : product.stock;
  const wishlisted = isWishlisted(product.id);

  const productReviews = reviews.filter((r) => r.productId === product.id && r.approved);
  const relatedProducts = products.filter((p) => p.id !== product.id && p.active).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, activeSize?.id || null, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, activeSize?.id || null, quantity);
    navigateTo({ name: 'checkout' });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewBody) return;
    addReview({
      productId: product.id,
      name: reviewName,
      rating: reviewRating,
      title: reviewTitle || undefined,
      body: reviewBody,
    });
    setReviewSubmitted(true);
    setReviewName('');
    setReviewTitle('');
    setReviewBody('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6f695f] mb-6 font-sans">
        <button onClick={() => navigateTo({ name: 'home' })} className="hover:text-[#16130f]">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#a39c91]" />
        <button onClick={() => navigateTo({ name: 'shop' })} className="hover:text-[#16130f]">
          Shop
        </button>
        <ChevronRight className="w-3 h-3 text-[#a39c91]" />
        <span className="text-[#16130f] font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout (Split Gallery + Contiguous Purchase Module) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Gallery (Left: 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Image */}
          <div className="relative aspect-[4/5] bg-[#f4eee3] border border-[#eee8da] overflow-hidden">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#16130f] text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-sans font-medium">
                Sale -{discountPercent}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#16130f] flex items-center justify-center shadow-md cursor-pointer transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4.5 h-4.5 ${
                  wishlisted ? 'fill-[#b8985f] text-[#b8985f]' : 'text-[#16130f]'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 bg-white border shrink-0 transition-all overflow-hidden cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#16130f] ring-1 ring-[#16130f]'
                      : 'border-[#eee8da] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module (Right: 5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#eee8da] p-6 sm:p-8 space-y-6">
          {/* Category & Status */}
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#b8985f] mb-1 font-sans font-medium">
              <span>{product.fragranceFamily}</span>
              <span className="capitalize text-[#6f695f]">{product.gender}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#16130f] font-medium leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5 text-[#b8985f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-[#16130f] font-medium font-sans">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#a39c91] font-sans">
                ({product.reviewCount} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-3 border-y border-[#eee8da] flex items-baseline justify-between">
            <div className="flex items-baseline gap-3 font-mono">
              <span className="text-2xl sm:text-3xl font-bold text-[#16130f]">
                Rs. {effectivePrice.toLocaleString('en-PK')}
              </span>
              {sale && sale < price && (
                <span className="text-sm text-[#a39c91] line-through">
                  Rs. {price.toLocaleString('en-PK')}
                </span>
              )}
            </div>
            <span
              className={`text-xs uppercase tracking-wider font-sans font-medium ${
                currentStock > 0 ? 'text-emerald-800' : 'text-rose-700'
              }`}
            >
              {currentStock > 0 ? `In Stock (${currentStock})` : 'Out of Stock'}
            </span>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#6f695f] leading-relaxed font-sans">
            {product.shortDescription}
          </p>

          {/* Flacon Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="uppercase tracking-[0.18em] text-[#16130f] font-medium">
                  Flacon Size
                </span>
                <span className="text-[#a39c91]">{activeSize.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((sz) => {
                  const isSelected = activeSize.id === sz.id;
                  const szPrice = sz.salePrice || sz.price;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => {
                        setSelectedSizeId(sz.id);
                        setQuantity(1);
                      }}
                      className={`p-3 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#16130f] bg-[#16130f] text-white shadow-xs'
                          : 'border-[#e4ddcf] bg-[#fbf9f4] hover:border-[#b8985f] text-[#16130f]'
                      }`}
                    >
                      <div className="font-sans font-medium text-xs">{sz.label}</div>
                      <div
                        className={`text-[11px] font-mono mt-0.5 ${
                          isSelected ? 'text-[#c9ad78]' : 'text-[#6f695f]'
                        }`}
                      >
                        Rs. {szPrice.toLocaleString('en-PK')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Actions (Desktop view) */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#e4ddcf] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-medium text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="w-10 h-12 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 bg-[#16130f] hover:bg-[#b8985f] text-white text-xs uppercase tracking-[0.18em] font-medium py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentStock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="w-full border border-[#16130f] text-[#16130f] hover:bg-[#16130f] hover:text-white text-xs uppercase tracking-[0.18em] font-medium py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Zap className="w-4 h-4 text-[#b8985f]" />
              <span>Buy with Cash on Delivery</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#eee8da] space-y-2 text-xs text-[#6f695f] font-sans">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#b8985f]" />
              <span>Free Delivery across Pakistan on this order</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8985f]" />
              <span>Authentic essence with 7-day guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Notes Pyramid / Details / Customer Reviews */}
      <section className="mt-14 pt-8 border-t border-[#eee8da]">
        <div className="flex border-b border-[#eee8da] gap-8 text-xs uppercase tracking-[0.2em] font-sans">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 font-medium cursor-pointer transition-colors relative ${
              activeTab === 'notes' ? 'text-[#16130f]' : 'text-[#a39c91] hover:text-[#16130f]'
            }`}
          >
            Fragrance Pyramid & Notes
            {activeTab === 'notes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8985f]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-medium cursor-pointer transition-colors relative ${
              activeTab === 'details' ? 'text-[#16130f]' : 'text-[#a39c91] hover:text-[#16130f]'
            }`}
          >
            Performance & Specification
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8985f]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-medium cursor-pointer transition-colors relative ${
              activeTab === 'reviews' ? 'text-[#16130f]' : 'text-[#a39c91] hover:text-[#16130f]'
            }`}
          >
            Reviews ({productReviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8985f]" />
            )}
          </button>
        </div>

        <div className="py-8">
          {/* TAB 1: FRAGRANCE NOTES PYRAMID */}
          {activeTab === 'notes' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top */}
                <div className="bg-[#f4eee3] p-6 border border-[#e4ddcf]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
                    First Impression (0-30 min)
                  </p>
                  <h3 className="font-serif text-xl text-[#16130f] font-medium mb-2">
                    Top Notes
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6f695f] leading-relaxed font-sans">
                    {product.topNotes}
                  </p>
                </div>

                {/* Heart */}
                <div className="bg-[#f4eee3] p-6 border border-[#e4ddcf]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
                    Signature Core (2-6 hours)
                  </p>
                  <h3 className="font-serif text-xl text-[#16130f] font-medium mb-2">
                    Heart Notes
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6f695f] leading-relaxed font-sans">
                    {product.heartNotes}
                  </p>
                </div>

                {/* Base */}
                <div className="bg-[#f4eee3] p-6 border border-[#e4ddcf]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
                    Lasting Sillage (8-14+ hours)
                  </p>
                  <h3 className="font-serif text-xl text-[#16130f] font-medium mb-2">
                    Base Notes
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6f695f] leading-relaxed font-sans">
                    {product.baseNotes}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 border border-[#eee8da] text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
                <h4 className="font-serif text-lg text-[#16130f] font-medium mb-2">
                  Composition Narrative
                </h4>
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          )}

          {/* TAB 2: PERFORMANCE & SPECIFICATION */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-white p-6 border border-[#eee8da] space-y-4 text-xs font-sans">
                <h4 className="font-serif text-lg text-[#16130f] font-medium pb-2 border-b border-[#eee8da]">
                  Performance Indicators
                </h4>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6f695f]">
                    <Clock className="w-4 h-4 text-[#b8985f]" /> Longevity
                  </span>
                  <span className="font-medium text-[#16130f]">{product.longevity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6f695f]">
                    <Wind className="w-4 h-4 text-[#b8985f]" /> Sillage & Projection
                  </span>
                  <span className="font-medium text-[#16130f]">{product.sillage}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6f695f]">
                    <Calendar className="w-4 h-4 text-[#b8985f]" /> Optimal Season
                  </span>
                  <span className="font-medium text-[#16130f]">{product.season}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6f695f]">
                    <Sparkles className="w-4 h-4 text-[#b8985f]" /> Occasion
                  </span>
                  <span className="font-medium text-[#16130f]">{product.occasion}</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-[#eee8da] space-y-4 text-xs font-sans">
                <h4 className="font-serif text-lg text-[#16130f] font-medium pb-2 border-b border-[#eee8da]">
                  Atelier Specs
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-[#6f695f]">Concentration</span>
                  <span className="font-medium text-[#16130f]">Extrait / Eau de Parfum (25%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6f695f]">Origin</span>
                  <span className="font-medium text-[#16130f]">Handcrafted in Lahore, Pakistan</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6f695f]">Cruelty Free</span>
                  <span className="font-medium text-[#16130f]">Yes · Zero Animal Testing</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6f695f]">Flacon</span>
                  <span className="font-medium text-[#16130f]">Weighted Italian Glass with Brushed Cap</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Existing Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                {productReviews.length === 0 ? (
                  <div className="bg-white p-8 border border-[#eee8da] text-center">
                    <p className="font-serif text-xl text-[#16130f] mb-1">Be the First to Review</p>
                    <p className="text-xs text-[#6f695f] font-sans">
                      Share your experience with this creation.
                    </p>
                  </div>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-6 border border-[#eee8da]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1 text-[#b8985f]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5"
                              fill={i < rev.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#a39c91] font-sans">
                          {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                        </span>
                      </div>
                      {rev.title && (
                        <h4 className="font-serif text-base text-[#16130f] font-medium mb-1">
                          {rev.title}
                        </h4>
                      )}
                      <p className="text-xs text-[#6f695f] font-sans leading-relaxed mb-3">
                        {rev.body}
                      </p>
                      <p className="text-[11px] font-medium text-[#16130f] font-sans">
                        — {rev.name}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="lg:col-span-5 bg-white p-6 border border-[#eee8da] font-sans">
                <h4 className="font-serif text-xl text-[#16130f] font-medium mb-3">
                  Write a Review
                </h4>

                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Thank you for sharing your thoughts on {product.name}!</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-[#b8985f] hover:scale-110 transition-transform"
                          >
                            <Star
                              className="w-5 h-5"
                              fill={star <= reviewRating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fatima Ali"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Review Title (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Unbelievable longevity"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Your Fragrance Review *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe the projection, compliment factor, and drydown..."
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#16130f] hover:bg-[#b8985f] text-white py-3 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                    >
                      Publish Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Fragrances */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#eee8da]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
              Complementary Notes
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#16130f] font-medium">
              You May Also Appreciate
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Purchase Bar (stays <15% viewport height) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#fbf9f4] border-t border-[#e4ddcf] p-3 md:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <p className="font-serif text-sm text-[#16130f] font-medium truncate max-w-[120px]">
            {product.name}
          </p>
          <p className="font-mono text-xs font-semibold text-[#16130f]">
            Rs. {effectivePrice.toLocaleString('en-PK')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="bg-[#16130f] text-white px-4 py-2.5 text-[11px] uppercase tracking-wider font-medium active:bg-[#b8985f]"
          >
            Add to Bag
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className="border border-[#16130f] text-[#16130f] px-3.5 py-2.5 text-[11px] uppercase tracking-wider font-medium active:bg-[#16130f] active:text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
