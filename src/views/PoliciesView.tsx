import React from 'react';
import { useStore } from '../context/StoreContext';

interface PoliciesViewProps {
  slug: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ slug }) => {
  const { settings, navigateTo } = useStore();

  const TITLES: Record<string, string> = {
    shipping: 'Shipping & Delivery Policy',
    returns: 'Returns & 7-Day Guarantee',
    privacy: 'Privacy & Data Protection',
    terms: 'Terms & Conditions of Sale',
  };

  const content =
    slug === 'shipping'
      ? settings.policy_shipping
      : slug === 'returns'
      ? settings.policy_returns
      : slug === 'privacy'
      ? settings.policy_privacy
      : settings.policy_terms;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Legal & Trust
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16130f] font-medium mb-3">
          {TITLES[slug] || 'Policy'}
        </h1>
        <div className="divider-gold mx-auto mb-4" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs uppercase tracking-wider font-sans">
        {(['shipping', 'returns', 'privacy', 'terms'] as const).map((k) => (
          <button
            key={k}
            onClick={() => navigateTo({ name: 'policy', slug: k })}
            className={`px-4 py-2 border transition-colors cursor-pointer ${
              slug === k
                ? 'bg-[#16130f] text-white border-[#16130f]'
                : 'bg-white text-[#6f695f] border-[#e4ddcf] hover:border-[#16130f]'
            }`}
          >
            {k === 'shipping'
              ? 'Shipping'
              : k === 'returns'
              ? 'Returns'
              : k === 'privacy'
              ? 'Privacy'
              : 'Terms'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#eee8da] p-6 sm:p-10 text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed whitespace-pre-line shadow-xs">
        {content}
      </div>
    </div>
  );
};
