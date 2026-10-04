import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Sparkles,
  Film,
  Compass,
  ArrowRight,
  Truck,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import velvetElixirImg from '../assets/images/arsh_velvet_elixir_1791108685284.jpg';
import heroImg from '../assets/images/hero_arsh_perfume_1791108673734.jpg';

export const Header: React.FC = () => {
  const {
    activePage,
    navigateTo,
    itemCount,
    cartTotal,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'parfums' | 'studios' | null>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo({ name: 'shop', params: { q: searchQuery.trim() } });
      setSearchOpen(false);
    }
  };

  const isNavActive = (pageName: string) => {
    if (pageName === 'home') return activePage.name === 'home';
    if (pageName === 'shop') return activePage.name === 'shop';
    if (pageName === 'collections') return activePage.name === 'collections' || activePage.name === 'collection';
    if (pageName === 'boutiques') return activePage.name === 'boutiques';
    if (pageName === 'studio') return activePage.name === 'studio';
    if (pageName === 'animator') return activePage.name === 'animator';
    return false;
  };

  const handleMouseEnter = (menu: 'parfums' | 'studios') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* 1. TOP UTILITY & CONCIERGE TICKER BAR */}
      <div className="bg-[#12100d] text-[#e8e2d5] text-[11px] font-sans border-b border-[#28241f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          {/* Left: Complimentary delivery offer */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse shrink-0" />
            <span className="tracking-wider text-[#d4ccbd] truncate">
              Complimentary Express Delivery Across Pakistan for Orders Over Rs. 5,000 · Cash on Delivery
            </span>
          </div>

          {/* Right: Concierge Quick Links */}
          <div className="hidden lg:flex items-center gap-6 text-[#bdae9c] shrink-0">
            <a
              href={`https://wa.me/${(settings.whatsapp || '923001234567').replace(/[^0-9]/g, '')}?text=Hello%20ARSH%C3%89%20Concierge`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Concierge WhatsApp</span>
            </a>

            <button
              onClick={() => navigateTo({ name: 'boutiques' })}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Ateliers & Boutiques</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'track-order' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>

            <button
              onClick={() => navigateTo({ name: 'admin' })}
              className="hover:text-white transition-colors flex items-center gap-1.5 text-[#c5a059] font-medium cursor-pointer bg-[#241f19] px-2.5 py-0.5 border border-[#c5a059]/40 rounded-xs"
              title="Open Admin Management Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Admin Console</span>
            </button>

            <span className="text-[#6d6457]">|</span>
            <span className="text-white/90 font-mono text-[10px] tracking-wider">PKR (Rs.)</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HAUTE LUXE NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#fdfcf9]/95 backdrop-blur-md border-b border-[#ece6d8] transition-all shadow-[0_2px_15px_-4px_rgba(22,19,15,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between relative">
          
          {/* Zone 1: Left Navigation Menu (Desktop) + Mobile Hamburger */}
          <div className="flex items-center gap-4 lg:w-1/3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] transition-colors rounded-sm cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-[12.5px] tracking-[0.2em] uppercase font-sans font-medium">
              {/* Parfums with Mega Menu */}
              <div
                className="relative py-4"
                onMouseEnter={() => handleMouseEnter('parfums')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo({ name: 'shop' })}
                  className={`hover:text-[#b8985f] transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isNavActive('shop') ? 'text-[#b8985f]' : 'text-[#16130f]'
                  }`}
                >
                  <span>Parfums</span>
                  <ChevronDown className="w-3 h-3 text-[#a39c91] transition-transform duration-200" />
                </button>

                {/* Parfums Dropdown Panel */}
                {activeDropdown === 'parfums' && (
                  <div className="absolute top-full left-0 w-[540px] bg-white border border-[#eee8da] shadow-xl p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 text-xs font-sans">
                    <div className="space-y-2.5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8985f] font-semibold border-b border-[#eee8da] pb-1.5">
                        By Olfactory Note
                      </p>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { family: 'oud' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Royal Oud & Amber
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { family: 'floral' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Damask & Taif Rose
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { family: 'fresh' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Mediterranean Citrus
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { family: 'woody' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Cedar & Smokewood
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#b8985f] font-semibold border-b border-[#eee8da] pb-1.5">
                        Curation
                      </p>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { gender: 'men' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Pour Homme (For Him)
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { gender: 'women' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Pour Femme (For Her)
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop', params: { gender: 'unisex' } });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#6f695f] hover:text-[#16130f] hover:translate-x-1 transition-all cursor-pointer"
                      >
                        Universal / Unisex
                      </button>
                      <button
                        onClick={() => {
                          navigateTo({ name: 'shop' });
                          setActiveDropdown(null);
                        }}
                        className="block text-left text-[#b8985f] font-medium hover:underline pt-1 cursor-pointer"
                      >
                        View All Extraits →
                      </button>
                    </div>

                    {/* Spotlight mini preview */}
                    <div
                      onClick={() => {
                        navigateTo({ name: 'product', slug: 'velvet-elixir' });
                        setActiveDropdown(null);
                      }}
                      className="bg-[#fcfbf7] border border-[#eee8da] p-3 text-center cursor-pointer group/card hover:border-[#b8985f] transition-all"
                    >
                      <div className="w-full aspect-[4/5] overflow-hidden mb-2">
                        <img
                          src={velvetElixirImg}
                          alt="Velvet Elixir"
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#b8985f]">Iconic Scent</p>
                      <p className="font-serif text-sm text-[#16130f] font-medium">Velvet Elixir</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Collections */}
              <button
                onClick={() => navigateTo({ name: 'collections' })}
                className={`hover:text-[#b8985f] transition-colors py-1 relative cursor-pointer ${
                  isNavActive('collections') ? 'text-[#b8985f]' : 'text-[#16130f]'
                }`}
              >
                <span>Collections</span>
              </button>

              {/* Studios & Atelier with dropdown */}
              <div
                className="relative py-4"
                onMouseEnter={() => handleMouseEnter('studios')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`hover:text-[#b8985f] transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    activePage.name === 'studio' || activePage.name === 'animator' || activePage.name === 'boutiques'
                      ? 'text-[#b8985f]'
                      : 'text-[#16130f]'
                  }`}
                >
                  <span>Atelier Studios</span>
                  <ChevronDown className="w-3 h-3 text-[#a39c91] transition-transform duration-200" />
                </button>

                {activeDropdown === 'studios' && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-[#eee8da] shadow-xl p-5 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 text-xs font-sans">
                    <button
                      onClick={() => {
                        navigateTo({ name: 'studio' });
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left p-2.5 rounded-sm hover:bg-[#fbf9f4] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center shrink-0 group-hover:bg-[#16130f] group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif text-sm font-medium text-[#16130f]">Bespoke Bottle Studio</p>
                        <p className="text-[11px] text-[#6f695f] leading-tight">
                          Design custom flacons & gold engraved labels with Gemini AI
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo({ name: 'animator' });
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left p-2.5 rounded-sm hover:bg-[#fbf9f4] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center shrink-0 group-hover:bg-[#16130f] group-hover:text-white transition-colors">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif text-sm font-medium text-[#16130f]">Flacon Video Animator</p>
                        <p className="text-[11px] text-[#6f695f] leading-tight">
                          Animate perfume bottles into cinematic 16:9 & 9:16 commercials
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo({ name: 'boutiques' });
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left p-2.5 rounded-sm hover:bg-[#fbf9f4] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center shrink-0 group-hover:bg-[#16130f] group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif text-sm font-medium text-[#16130f]">Atelier & Boutique Locator</p>
                        <p className="text-[11px] text-[#6f695f] leading-tight">
                          Explore Lahore, Karachi & Islamabad flagship locations on Maps
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Zone 2: CENTERPIECE BRAND WORDMARK (Exact luxury styling matching user's photo) */}
          <div className="text-center lg:w-1/3 flex flex-col items-center justify-center">
            <button
              onClick={() => navigateTo({ name: 'home' })}
              className="text-center group cursor-pointer inline-flex flex-col items-center select-none"
              aria-label="ARSHÉ Home"
            >
              {/* High-contrast luxury serif matching reference photo with acute accent on É */}
              <span className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[0.24em] text-[#12100d] group-hover:text-[#b8985f] transition-colors leading-none">
                ARSHÉ
              </span>
              <span className="block text-[8px] sm:text-[9.5px] tracking-[0.38em] text-[#b8985f] font-sans font-medium uppercase mt-1 leading-none">
                HAUTE PARFUMERIE · LAHORE
              </span>
            </button>
          </div>

          {/* Zone 3: Right Interactive Controls */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 lg:w-1/3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center text-[#16130f] hover:text-[#b8985f] hover:bg-[#f4eee3] transition-colors rounded-sm cursor-pointer"
                aria-label="Search Fragrances"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Quick Search Dropdown Flyout */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#eee8da] p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search notes, oud, extrait..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f] font-sans"
                    />
                    <button
                      type="submit"
                      className="bg-[#16130f] hover:bg-[#b8985f] text-white px-3 py-2 text-xs uppercase tracking-wider font-medium transition-colors shrink-0 cursor-pointer"
                    >
                      Find
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Admin Console Shortcut */}
            <button
              onClick={() => navigateTo({ name: 'admin' })}
              className="w-10 h-10 flex items-center justify-center text-[#16130f] hover:text-[#b8985f] hover:bg-[#f4eee3] transition-colors rounded-sm cursor-pointer"
              title="Store Management & Admin Console"
              aria-label="Admin Console"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo({ name: 'wishlist' })}
              className="relative w-10 h-10 flex items-center justify-center text-[#16130f] hover:text-[#b8985f] hover:bg-[#f4eee3] transition-colors rounded-sm cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#b8985f] text-white text-[10px] font-sans flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2 px-3 py-2 border border-[#16130f] hover:bg-[#16130f] hover:text-white transition-all duration-200 cursor-pointer rounded-xs"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#16130f] group-hover:text-white transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#b8985f] text-white text-[9px] font-mono flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-sans font-medium uppercase tracking-wider">
                Bag {itemCount > 0 && `(${itemCount})`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
