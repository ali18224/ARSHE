import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, showToast } = useStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    showToast('Your message has been sent to our concierge team.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Concierge Services
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#16130f] font-medium mb-3">
          Get in Touch
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          Whether you need personalized fragrance recommendations, order inquiries, or corporate gifting arrangements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 bg-white border border-[#eee8da] p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-[#16130f] font-medium pb-3 border-b border-[#eee8da]">
            The ARSHÉ Concierge
          </h2>

          <div className="space-y-4 text-xs font-sans text-[#6f695f]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#b8985f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#16130f] block mb-0.5">Atelier Address</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#b8985f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#16130f] block mb-0.5">Direct Line</strong>
                <a href={`tel:${settings.phone}`} className="hover:text-[#16130f]">
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#b8985f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#16130f] block mb-0.5">Email Inquiries</strong>
                <a href={`mailto:${settings.email}`} className="hover:text-[#16130f]">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-[#b8985f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#16130f] block mb-0.5">Instant WhatsApp</strong>
                <span>Direct customer service available 10:00 AM – 9:00 PM PKT daily</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#eee8da]">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=Hello%20ARSH%C3%89%20Fragrance%20Concierge`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#16130f] hover:bg-[#b8985f] text-white py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#c9ad78]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right: Interactive Form */}
        <div className="lg:col-span-7 bg-white border border-[#eee8da] p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-[#16130f] font-medium mb-4">
            Send an Atelier Inquiry
          </h2>

          {submitted ? (
            <div className="p-8 text-center bg-[#f4eee3] border border-[#e4ddcf] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#b8985f] mx-auto" />
              <h3 className="font-serif text-2xl text-[#16130f]">Message Received</h3>
              <p className="text-xs text-[#6f695f] font-sans max-w-sm mx-auto">
                Thank you for contacting ARSHÉ. Our fragrance consultants in Lahore will respond via email or WhatsApp within a few hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="mt-2 text-xs uppercase tracking-wider text-[#b8985f] underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Phone / WhatsApp (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="03xx-xxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Perfume recommendation, Wedding gift set"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How may our fragrance atelier assist you today?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#16130f] hover:bg-[#b8985f] text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
