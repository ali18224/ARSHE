import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings } = useStore();

  return (
    <footer className="bg-[#16130f] text-[#eee8da]/80 border-t border-[#28241f] mt-24">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Manifesto */}
        <div className="lg:col-span-2 space-y-4">
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.24em] font-light text-[#fbf9f4] block">
            ARSHÉ
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9ad78] font-sans">
            Haute Parfumerie Atelier · Lahore, Pakistan
          </p>
          <p className="text-sm text-[#eee8da]/60 leading-relaxed font-sans max-w-sm">
            Handcrafted with patience, rare absolutes, and revered Cambodian oud. Formulated for profound sillage, projection, and timeless distinction.
          </p>
          <div className="pt-2 flex flex-col gap-2 text-xs text-[#eee8da]/70">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#b8985f] shrink-0" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#b8985f] shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#b8985f] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#c9ad78] mb-4 font-sans font-medium">
            Fragrances
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <button
                onClick={() => navigateTo({ name: 'shop' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                All Perfumes
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'shop', params: { gender: 'men' } })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                For Him
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'shop', params: { gender: 'women' } })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                For Her
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'shop', params: { family: 'oud' } })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Royal Oud Series
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'collections' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Curated Gift Sets
              </button>
            </li>
          </ul>
        </div>

        {/* Concierge & Care */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#c9ad78] mb-4 font-sans font-medium">
            Concierge
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <button
                onClick={() => navigateTo({ name: 'boutiques' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ateliers & Boutiques (Maps)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'studio' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Bespoke Bottle Studio (AI)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'animator' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Flacon Video Animator (Veo)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'track-order' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Track Your Order
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'contact' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Contact & WhatsApp
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'about' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                The Atelier Story
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'faq' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=Hello%20ARSH%C3%89%20Fragrance%20Concierge`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#c9ad78] hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#c9ad78] mb-4 font-sans font-medium">
            Policies
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <button
                onClick={() => navigateTo({ name: 'policy', slug: 'shipping' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'policy', slug: 'returns' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                7-Day Guarantee & Returns
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'policy', slug: 'privacy' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy & Data
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'policy', slug: 'terms' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li className="pt-2">
              <button
                onClick={() => navigateTo({ name: 'admin' })}
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#c9ad78] transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-[#b8985f]" />
                <span>Store Management Console</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-[#28241f] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#eee8da]/40 font-sans">
          <p>© {new Date().getFullYear()} ARSHÉ Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Express Courier Pakistan</span>
            <span>·</span>
            <span>100% Original Essence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
