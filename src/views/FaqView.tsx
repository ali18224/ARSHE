import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    q: 'Do you deliver across all cities in Pakistan?',
    a: 'Yes, absolutely. We provide nationwide express delivery across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad, Gilgit-Baltistan, and Azad Kashmir via TCS and Leopards Courier. Orders typically arrive within 2 to 4 business days.',
  },
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'You do not need to make any advance digital payments. Simply place your order online, and our courier agent will bring the package to your doorstep where you can pay the exact invoice amount in cash upon receiving the package.',
  },
  {
    q: 'How long do ARSHÉ fragrances last on skin and fabric?',
    a: 'All ARSHÉ creations are crafted at high Extrait / Eau de Parfum concentration (25% perfume oil). Depending on your skin chemistry and weather, expect 12 to 16+ hours on skin and up to 24+ hours on fabrics.',
  },
  {
    q: 'What is your return & exchange guarantee?',
    a: 'We offer an unconditional 7-day guarantee. If your bottle arrives damaged or with any leakage, we provide an immediate replacement with zero return shipping costs. Unopened bottles with the tamper seal intact can also be exchanged.',
  },
  {
    q: 'Are your perfume oils synthetic or authentic natural extractions?',
    a: 'We prioritize genuine natural essences: Cambodian agarwood, Taif rose petals, and Kashmir saffron, blended in alcohol that has been matured for smooth, skin-friendly diffusion without harsh alcohol odor.',
  },
  {
    q: 'Can I track my order once it has been dispatched?',
    a: 'Yes! Navigate to our Track Order page at any time and enter your Order Number (e.g. ARS-20261001-4821) along with your phone number to check live processing and courier status.',
  },
];

export const FaqView: React.FC = () => {
  const { navigateTo } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Help & Inquiries
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#16130f] font-medium mb-3">
          Frequently Asked Questions
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans">
          Everything you need to know regarding ARSHÉ perfumes, delivery, and guarantees.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white border border-[#eee8da] transition-colors overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-serif text-base sm:text-lg text-[#16130f] font-medium">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#b8985f] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed border-t border-[#f4eee3]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div className="mt-12 bg-[#f4eee3] p-8 border border-[#e4ddcf] text-center space-y-3">
        <h3 className="font-serif text-2xl text-[#16130f]">Still Have Questions?</h3>
        <p className="text-xs text-[#6f695f] font-sans max-w-sm mx-auto">
          Our fragrance concierge is delighted to offer custom olfactory advice or answer any shipment inquiry.
        </p>
        <button
          onClick={() => navigateTo({ name: 'contact' })}
          className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-3 text-xs uppercase tracking-wider font-medium transition-colors"
        >
          Contact Our Concierge
        </button>
      </div>
    </div>
  );
};
