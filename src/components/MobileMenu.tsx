import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShieldCheck, Phone, MessageSquare, Compass, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { navigateTo, settings, wishlist } = useStore();

  if (!isOpen) return null;

  const handleNav = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[85%] max-w-sm bg-[#fbf9f4] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Top header */}
        <div className="p-5 border-b border-[#eee8da] flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl tracking-[0.24em] font-normal text-[#12100d] block">
              ARSHÉ
            </span>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#b8985f] font-sans font-medium mt-0.5">
              HAUTE PARFUMERIE · LAHORE
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] transition-colors rounded-sm cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          <button
            onClick={() => handleNav(() => navigateTo({ name: 'home' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] font-serif text-lg text-[#16130f] flex items-center justify-between"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'shop' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] font-serif text-lg text-[#16130f] flex items-center justify-between"
          >
            <span>Shop All Fragrances</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'collections' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] font-serif text-lg text-[#16130f] flex items-center justify-between"
          >
            <span>Curated Collections</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <div className="py-3 border-b border-[#eee8da]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b8985f] mb-2 font-sans font-medium">
              Shop by Gender
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleNav(() => navigateTo({ name: 'shop', params: { gender: 'men' } }))}
                className="py-2 text-xs uppercase tracking-wider text-center border border-[#e4ddcf] bg-white text-[#16130f] active:bg-[#16130f] active:text-white"
              >
                For Him
              </button>
              <button
                onClick={() => handleNav(() => navigateTo({ name: 'shop', params: { gender: 'women' } }))}
                className="py-2 text-xs uppercase tracking-wider text-center border border-[#e4ddcf] bg-white text-[#16130f] active:bg-[#16130f] active:text-white"
              >
                For Her
              </button>
              <button
                onClick={() => handleNav(() => navigateTo({ name: 'shop', params: { gender: 'unisex' } }))}
                className="py-2 text-xs uppercase tracking-wider text-center border border-[#e4ddcf] bg-white text-[#16130f] active:bg-[#16130f] active:text-white"
              >
                Unisex
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'shop', params: { family: 'oud' } }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Royal Oud Collection</span>
            <Compass className="w-4 h-4 text-[#b8985f]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'wishlist' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#b8985f]" />
              Wishlist
            </span>
            {wishlist.length > 0 && (
              <span className="text-xs bg-[#b8985f] text-white px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'boutiques' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Boutiques & Ateliers (Maps)</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'studio' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Bespoke Bottle Studio (AI)</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'animator' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Flacon Video Studio (Veo)</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'track-order' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Track Order (COD)</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'about' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>About Atelier</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'contact' }))}
            className="w-full text-left py-3 border-b border-[#eee8da] text-sm text-[#16130f] flex items-center justify-between"
          >
            <span>Contact & WhatsApp</span>
            <ChevronRight className="w-4 h-4 text-[#a39c91]" />
          </button>

          <button
            onClick={() => handleNav(() => navigateTo({ name: 'admin' }))}
            className="w-full text-left p-3 my-2 bg-[#16130f] text-white border border-[#b8985f]/40 flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-xs uppercase tracking-wider font-medium text-[#c9ad78]">
              <ShieldCheck className="w-4 h-4 text-[#c9ad78]" />
              Store Admin Console
            </span>
            <ChevronRight className="w-4 h-4 text-[#c9ad78]" />
          </button>
        </div>

        {/* Concierge footer */}
        <div className="p-5 bg-[#f4eee3] border-t border-[#eee8da] text-xs text-[#6f695f] space-y-2">
          <p className="font-serif text-sm text-[#16130f] font-medium">Customer Concierge</p>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#b8985f]" />
            <a href={`tel:${settings.phone}`} className="hover:text-[#16130f]">
              {settings.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#b8985f]" />
            <span>Cash on Delivery nationwide</span>
          </div>
        </div>
      </div>
    </div>
  );
};
