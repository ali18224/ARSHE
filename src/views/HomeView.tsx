import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Sparkles,
  Gift,
  Clock,
  Truck,
  Banknote,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';
import type { FragranceFamily } from '../types';

export const HomeView: React.FC = () => {
  const {
    products,
    collections,
    reviews,
    homepageContent,
    navigateTo,
    showToast,
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const hero = homepageContent.hero;
  const brandStory = homepageContent.brandStory;

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const featuredProduct = products.find((p) => p.isFeatured) || products[0];
  const approvedReviews = reviews.filter((r) => r.approved).slice(0, 3);

  const families: { key: FragranceFamily; name: string; notes: string; desc: string }[] = [
    { key: 'oud', name: 'Royal Oud', notes: 'Cambodian Agarwood · Taif Rose', desc: 'Resinous, magnetic, majestic' },
    { key: 'woody', name: 'Noble Woods', notes: 'Atlas Cedar · Vetiver · Leather', desc: 'Dignified, smoky, grounding' },
    { key: 'floral', name: 'Dark Florals', notes: 'Midnight Rose · Bourbon Vanilla', desc: 'Intoxicating, seductive, deep' },
    { key: 'citrus', name: 'Solar Citrus', notes: 'Calabrian Lemon · Tunisian Neroli', desc: 'Crisp, radiant, uplifting' },
    { key: 'oriental', name: 'Amber & Spice', notes: 'Kashmir Saffron · Fossil Amber', desc: 'Opulent, warm, aristocratic' },
    { key: 'fresh', name: 'Airy Clean', notes: 'White Musk · Cotton Blossom', desc: 'Purity, effortless, intimate' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the ARSHÉ Circle. You will receive private previews.', 'success');
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. HERO SECTION (Campaign Focal Point) */}
      <section className="relative bg-[#f4eee3] border-b border-[#eee8da] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#b8985f] font-sans font-medium">
              <span className="w-6 h-px bg-[#b8985f]" />
              <span>{hero.eyebrow}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#16130f] leading-[1.08] tracking-tight text-balance">
              {hero.heading}
            </h1>

            <p className="text-base sm:text-lg text-[#6f695f] leading-relaxed font-sans">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigateTo({ name: 'shop' })}
                className="bg-[#16130f] hover:bg-[#b8985f] text-[#fbf9f4] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{hero.ctaPrimary.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo({ name: 'collections' })}
                className="border border-[#16130f] text-[#16130f] hover:bg-[#16130f] hover:text-[#fbf9f4] px-7 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>{hero.ctaSecondary.label}</span>
              </button>
            </div>

            {/* Quick trust strip */}
            <div className="pt-4 border-t border-[#e4ddcf] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6f695f] font-sans">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#b8985f]" /> Free delivery above Rs. 5,000
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-[#b8985f]" /> Cash on Delivery Nationwide
              </span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-white border border-[#eee8da] overflow-hidden shadow-xl">
            {hero.image ? (
              <img
                src={hero.image}
                alt="ARSHÉ Signature Perfume"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            ) : null}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xs p-3.5 border border-[#e4ddcf] flex items-center justify-between text-xs font-sans">
              <div>
                <p className="font-serif text-sm text-[#16130f] font-medium">Velvet Elixir</p>
                <p className="text-[10px] text-[#6f695f] uppercase tracking-wider">Persian Saffron · Cambodian Oud</p>
              </div>
              <button
                onClick={() => navigateTo({ name: 'product', slug: 'velvet-elixir' })}
                className="text-[#b8985f] hover:text-[#16130f] font-medium uppercase tracking-wider underline underline-offset-2 cursor-pointer"
              >
                Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE ARSH PROMISE / TRUST TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 border-y border-[#eee8da] py-8">
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#f4eee3] flex items-center justify-center text-[#b8985f] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base text-[#16130f] font-medium">Fine Raw Essence</h4>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">Taif rose & Cambodian agarwood</p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#f4eee3] flex items-center justify-center text-[#b8985f] mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base text-[#16130f] font-medium">12+ Hour Longevity</h4>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">High perfume oil concentration</p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#f4eee3] flex items-center justify-center text-[#b8985f] mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base text-[#16130f] font-medium">Gift Presentation</h4>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">Gold-embossed keepsake box</p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#f4eee3] flex items-center justify-center text-[#b8985f] mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base text-[#16130f] font-medium">Nationwide Courier</h4>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">Delivered in 2 to 4 business days</p>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#f4eee3] flex items-center justify-center text-[#b8985f] mb-3">
              <Banknote className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base text-[#16130f] font-medium">Cash on Delivery</h4>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">Inspect and pay upon arrival</p>
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#eee8da]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
              Just Unveiled
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#16130f] font-medium">
              New Fragrance Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigateTo({ name: 'shop', params: { family: undefined } })}
            className="mt-3 md:mt-0 text-xs uppercase tracking-[0.18em] text-[#16130f] hover:text-[#b8985f] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SCENT DISCOVERY / FRAGRANCE FAMILIES */}
      <section className="bg-[#f4eee3] py-16 border-y border-[#eee8da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
              Olfactory Compass
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#16130f] font-medium mb-3">
              Explore by Fragrance Family
            </h2>
            <div className="divider-gold mx-auto mb-3" />
            <p className="text-sm text-[#6f695f] font-sans leading-relaxed">
              Every persona aligns with a distinct olfactory chord. Select a signature character below.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {families.map((f) => (
              <button
                key={f.key}
                onClick={() => navigateTo({ name: 'shop', params: { family: f.key } })}
                className="group bg-white p-5 border border-[#e4ddcf] hover:border-[#b8985f] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#f4eee3] group-hover:bg-[#b8985f] group-hover:text-white text-[#b8985f] flex items-center justify-center transition-colors mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-[#16130f] font-medium group-hover:text-[#b8985f] transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-[11px] text-[#6f695f] font-sans mt-1 line-clamp-2">
                    {f.notes}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#b8985f] mt-4 font-sans font-medium flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#eee8da]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
              Customer Favorites
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#16130f] font-medium">
              The Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo({ name: 'shop' })}
            className="mt-3 md:mt-0 text-xs uppercase tracking-[0.18em] text-[#16130f] hover:text-[#b8985f] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. FEATURED SPOTLIGHT: VELVET ELIXIR */}
      {featuredProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#16130f] text-[#fbf9f4] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9ad78] font-sans">
                Atelier Masterwork
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#fbf9f4] font-medium leading-tight">
                {featuredProduct.name}
              </h2>
              <p className="text-sm md:text-base text-[#eee8da]/80 font-sans leading-relaxed">
                {featuredProduct.description.split('\n\n')[0]}
              </p>

              {/* Notes Triad */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-xs font-sans">
                <div>
                  <p className="text-[#c9ad78] uppercase tracking-wider text-[10px] mb-1">Top Notes</p>
                  <p className="text-[#eee8da]/90">{featuredProduct.topNotes.split(',')[0]}</p>
                </div>
                <div>
                  <p className="text-[#c9ad78] uppercase tracking-wider text-[10px] mb-1">Heart Notes</p>
                  <p className="text-[#eee8da]/90">{featuredProduct.heartNotes.split(',')[0]}</p>
                </div>
                <div>
                  <p className="text-[#c9ad78] uppercase tracking-wider text-[10px] mb-1">Base Notes</p>
                  <p className="text-[#eee8da]/90">{featuredProduct.baseNotes.split(',')[0]}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigateTo({ name: 'product', slug: featuredProduct.slug })}
                  className="bg-[#b8985f] hover:bg-[#c9ad78] text-[#16130f] px-8 py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer"
                >
                  Experience {featuredProduct.name}
                </button>
                <span className="font-mono text-lg text-white font-semibold">
                  Rs. {featuredProduct.basePrice.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            <div className="relative aspect-square max-w-md mx-auto w-full bg-white/5 border border-white/10 overflow-hidden">
              <img
                src={featuredProduct.images[0]}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* 7. CURATED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
            Curated Expressions
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#16130f] font-medium mb-2">
            The Collections
          </h2>
          <div className="divider-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((coll) => (
            <div
              key={coll.id}
              onClick={() => navigateTo({ name: 'collection', slug: coll.slug })}
              className="group bg-white border border-[#eee8da] hover:border-[#b8985f] overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="relative aspect-[4/5] bg-[#f4eee3] overflow-hidden">
                {coll.image && (
                  <img
                    src={coll.image}
                    alt={coll.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9ad78] mb-1 font-sans">
                    Collection
                  </p>
                  <h3 className="font-serif text-xl font-medium leading-tight mb-1">
                    {coll.name}
                  </h3>
                  <span className="text-xs uppercase tracking-wider text-white/80 group-hover:text-white flex items-center gap-1">
                    <span>View Fragrances</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7.5 ATELIER INNOVATIONS (Google Maps, Bottle Studio, Veo Animator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#16130f] text-[#fbf9f4] p-8 md:p-12 border border-[#28241f]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9ad78] font-sans font-medium mb-1">
              Atelier Experiences
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-medium mb-2">
              Explore ARSHÉ Digital Studios
            </h2>
            <div className="w-12 h-0.5 bg-[#c9ad78] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Maps */}
            <div
              onClick={() => navigateTo({ name: 'boutiques' })}
              className="bg-white/5 border border-white/10 hover:border-[#c9ad78] p-6 space-y-3 cursor-pointer transition-all hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-full bg-[#c9ad78]/20 text-[#c9ad78] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-white">
                Boutique & Atelier Locator
              </h3>
              <p className="text-xs text-[#eee8da]/70 font-sans leading-relaxed">
                Explore real ARSHÉ flagship ateliers and luxury fragrance stockists across Lahore, Karachi, and Islamabad with Google Maps data.
              </p>
              <span className="text-xs uppercase tracking-wider text-[#c9ad78] font-sans flex items-center gap-1.5 pt-2">
                <span>Find Boutiques</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* 2. Bottle Studio */}
            <div
              onClick={() => navigateTo({ name: 'studio' })}
              className="bg-white/5 border border-white/10 hover:border-[#c9ad78] p-6 space-y-3 cursor-pointer transition-all hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-full bg-[#c9ad78]/20 text-[#c9ad78] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-white">
                Bespoke Bottle Studio
              </h3>
              <p className="text-xs text-[#eee8da]/70 font-sans leading-relaxed">
                Design custom perfume flacons, glass tints, and engraved gold foil calligraphy labels using Gemini image generation.
              </p>
              <span className="text-xs uppercase tracking-wider text-[#c9ad78] font-sans flex items-center gap-1.5 pt-2">
                <span>Design Flacon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* 3. Veo Animator */}
            <div
              onClick={() => navigateTo({ name: 'animator' })}
              className="bg-white/5 border border-white/10 hover:border-[#c9ad78] p-6 space-y-3 cursor-pointer transition-all hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-full bg-[#c9ad78]/20 text-[#c9ad78] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-white">
                Flacon Video Studio
              </h3>
              <p className="text-xs text-[#eee8da]/70 font-sans leading-relaxed">
                Animate any perfume bottle into a 16:9 or 9:16 cinematic commercial video with Veo video generations.
              </p>
              <span className="text-xs uppercase tracking-wider text-[#c9ad78] font-sans flex items-center gap-1.5 pt-2">
                <span>Animate Video</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ATELIER STORY / CRAFTSMANSHIP */}
      <section className="bg-[#f4eee3] py-16 md:py-24 border-y border-[#eee8da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium">
            {brandStory.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#16130f] font-medium leading-tight">
            {brandStory.title}
          </h2>
          <div className="divider-gold mx-auto" />
          <p className="text-base md:text-lg text-[#6f695f] leading-relaxed font-sans max-w-2xl mx-auto">
            {brandStory.text}
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigateTo({ name: 'about' })}
              className="inline-flex items-center gap-2 border-b-2 border-[#16130f] pb-1 text-xs uppercase tracking-[0.2em] text-[#16130f] hover:text-[#b8985f] hover:border-[#b8985f] font-medium transition-colors cursor-pointer"
            >
              <span>{brandStory.cta.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS */}
      {approvedReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
              Patron Impressions
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#16130f] font-medium mb-2">
              What Customers Say
            </h2>
            <div className="divider-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedReviews.map((rev) => {
              const product = products.find((p) => p.id === rev.productId);
              return (
                <div
                  key={rev.id}
                  className="bg-white p-7 border border-[#eee8da] hover:border-[#b8985f]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 text-[#b8985f] mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>

                    {rev.title && (
                      <h4 className="font-serif text-lg text-[#16130f] font-medium mb-2">
                        "{rev.title}"
                      </h4>
                    )}

                    <p className="text-xs text-[#6f695f] font-sans leading-relaxed mb-4">
                      {rev.body}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#eee8da] flex items-center justify-between text-xs font-sans">
                    <span className="font-medium text-[#16130f]">{rev.name}</span>
                    {product && (
                      <button
                        onClick={() => navigateTo({ name: 'product', slug: product.slug })}
                        className="text-[#b8985f] hover:underline"
                      >
                        {product.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. NEWSLETTER / CIRCLE */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="bg-white p-8 md:p-12 border border-[#eee8da] space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium">
            Private Access
          </p>
          <h2 className="font-serif text-3xl text-[#16130f] font-medium">
            Join the ARSHÉ Circle
          </h2>
          <p className="text-xs sm:text-sm text-[#6f695f] font-sans max-w-md mx-auto leading-relaxed">
            Subscribers receive first access to limited harvest distillations, rare attars, and private seasonal invitations.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-50 px-4 py-2.5 text-xs font-sans border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are now subscribed to the ARSHÉ Circle.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#fbf9f4] border border-[#e4ddcf] text-xs text-[#16130f] placeholder:text-[#a39c91] focus:outline-none focus:border-[#b8985f]"
              />
              <button
                type="submit"
                className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
