import React from 'react';
import { useStore } from '../context/StoreContext';
import heroImg from '../assets/images/hero_arsh_perfume_1791108673734.jpg';
import velvetElixirImg from '../assets/images/arsh_velvet_elixir_1791108685284.jpg';
import { Sparkles, MapPin, Feather, HeartHandshake } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b8985f] font-sans font-medium">
          The Atelier Heritage
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#16130f] font-light tracking-[0.08em] leading-tight">
          About ARSHÉ
        </h1>
        <div className="divider-gold mx-auto" />
        <p className="font-serif text-xl sm:text-2xl text-[#6f695f] italic">
          "Fragrance is the quietest, most resonant articulation of one’s identity."
        </p>
      </div>

      {/* Two Column Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] bg-[#f4eee3] border border-[#eee8da] overflow-hidden shadow-lg">
          <img
            src={heroImg}
            alt="ARSHÉ Fragrance Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16130f] font-medium">
            Rooted in Lahore, Inspired by Antiquity
          </h2>
          <p>
            ARSHÉ was conceived from a deep reverence for the historic perfumery traditions of the subcontinent. Long before modern chemistry replaced natural craft, Mughal royal courts in Lahore, Delhi, and Kashmir distilled rare botanicals, ambergris, and agarwood into oils that could outlast the seasons.
          </p>
          <p>
            We set out to revive this uncompromising standard. By pairing age-old distillations from Taif and Cambodia with modern French maceration and precision formulation, ARSHÉ creates perfumes with true depth, majestic sillage, and evocative emotional resonance.
          </p>
          <p>
            Each bottle is blended in limited batches in Lahore, aged in dark glass maturation vessels, and poured by hand. We believe genuine luxury should be authentic, transparent, and presented with dignity.
          </p>
        </div>
      </div>

      {/* Craft Pillars */}
      <div className="bg-[#f4eee3] p-8 md:p-12 border border-[#e4ddcf] grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#b8985f] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#16130f] font-medium">
            Noble Raw Ingredients
          </h3>
          <p className="text-xs text-[#6f695f] font-sans leading-relaxed">
            We partner with generational distillers for 10-year aged Cambodian agarwood, hand-harvested Persian saffron, and Damascus rose absolutes.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#b8985f] flex items-center justify-center mb-3">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#16130f] font-medium">
            25% Extrait Concentration
          </h3>
          <p className="text-xs text-[#6f695f] font-sans leading-relaxed">
            Our compositions feature high perfume oil ratios that ensure 12 to 16 hours of steady, magnetic projection without synthetic cloying sharpness.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#b8985f] flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#16130f] font-medium">
            Cash on Delivery Trust
          </h3>
          <p className="text-xs text-[#6f695f] font-sans leading-relaxed">
            Trust is earned bottle by bottle. We deliver across every province in Pakistan with Cash on Delivery and a 7-day satisfaction guarantee.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigateTo({ name: 'shop' })}
          className="bg-[#16130f] hover:bg-[#b8985f] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
        >
          Explore Our Perfumes
        </button>
      </div>
    </div>
  );
};
