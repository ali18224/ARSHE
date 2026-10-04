import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, navigateTo } = useStore();

  if (!settings.announcement_enabled || !settings.announcement_text) return null;

  return (
    <div className="bg-[#16130f] text-[#fbf9f4] border-b border-[#28241f] text-center text-[11px] md:text-xs tracking-[0.18em] uppercase py-2.5 px-4 font-sans select-none flex items-center justify-center gap-2">
      <Sparkles className="w-3 h-3 text-[#c9ad78] animate-pulse shrink-0" />
      <span className="truncate max-w-[85vw] sm:max-w-none">{settings.announcement_text}</span>
      <button
        onClick={() => navigateTo({ name: 'shop' })}
        className="hidden sm:inline-block ml-2 text-[#c9ad78] hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
      >
        Shop Now
      </button>
    </div>
  );
};
