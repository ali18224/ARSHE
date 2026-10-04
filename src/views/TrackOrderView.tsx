import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Order, OrderStatus } from '../types';
import { Search, Package, Check, Phone, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const { findOrder, orders } = useStore();

  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'pending', label: 'Order Placed', desc: 'Received at Lahore atelier' },
    { status: 'confirmed', label: 'Confirmed', desc: 'Customer details verified' },
    { status: 'processing', label: 'Atelier Processing', desc: 'Flacon bottled & hand-sealed' },
    { status: 'shipped', label: 'Dispatched', desc: 'En route via courier service' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent on route to doorstep' },
    { status: 'delivered', label: 'Delivered', desc: 'Cash collected & received' },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSearched(true);

    if (!orderNumber.trim()) {
      setErrorMsg('Please enter your order number (e.g. ARS-20261001-4821).');
      return;
    }

    const order = findOrder(orderNumber, phone);
    if (order) {
      setFoundOrder(order);
    } else {
      setFoundOrder(null);
      setErrorMsg('No order found matching this Order Number and Phone. Please verify your details.');
    }
  };

  const handleSampleFill = (sample: Order) => {
    setOrderNumber(sample.orderNumber);
    setPhone(sample.phone);
    setFoundOrder(sample);
    setSearched(true);
    setErrorMsg(null);
  };

  const getStepIndex = (status: OrderStatus) => {
    return STEPS.findIndex((s) => s.status === status);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-2">
          Dispatch & Courier
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#16130f] font-medium mb-3">
          Track Your Fragrance
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          Enter your ARSHÉ order number and contact phone number to track preparation and courier status.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white border border-[#eee8da] p-6 sm:p-8 space-y-4 shadow-xs">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ARS-20261001-4821"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] font-mono focus:outline-none focus:border-[#b8985f]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                Mobile Phone (last 4 or full) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 03014589211"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#16130f] hover:bg-[#b8985f] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Track Order Now</span>
          </button>
        </form>
      </div>

      {/* Error Message */}
      {searched && errorMsg && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Found Order Card */}
      {foundOrder && (
        <div className="mt-8 bg-white border border-[#eee8da] p-6 sm:p-8 space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eee8da]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#a39c91] block font-sans">
                Tracking Details
              </span>
              <h3 className="font-mono text-xl sm:text-2xl font-bold text-[#16130f]">
                {foundOrder.orderNumber}
              </h3>
              <p className="text-xs text-[#6f695f] font-sans mt-0.5">
                Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-PK', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#a39c91] block font-sans">
                Payment Type
              </span>
              <span className="font-semibold text-xs text-[#16130f] uppercase font-sans">
                Cash on Delivery (Rs. {foundOrder.total.toLocaleString('en-PK')})
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-[#16130f] font-medium">
              Shipment Status
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eee8da]">
              {STEPS.map((step, idx) => {
                const currentIdx = getStepIndex(foundOrder.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isCompleted
                          ? 'bg-[#16130f] text-white'
                          : 'bg-[#eee8da] text-[#a39c91]'
                      } ${isCurrent ? 'ring-4 ring-[#b8985f]/30 bg-[#b8985f]' : ''}`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="text-xs font-sans">
                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? 'text-[#b8985f] text-sm'
                            : isCompleted
                            ? 'text-[#16130f]'
                            : 'text-[#a39c91]'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[#6f695f] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recipient & Address */}
          <div className="pt-4 border-t border-[#eee8da] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#6f695f]">
            <div>
              <p className="font-semibold text-[#16130f] uppercase tracking-wider text-[10px] mb-1">
                Recipient
              </p>
              <p>{foundOrder.customerName}</p>
              <p>{foundOrder.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-[#16130f] uppercase tracking-wider text-[10px] mb-1">
                Destination
              </p>
              <p>{foundOrder.address}</p>
              <p>
                {foundOrder.city}, {foundOrder.province}
              </p>
            </div>
          </div>

          {/* Internal notes if courier tracking exists */}
          {foundOrder.internalNotes && (
            <div className="p-3 bg-[#f4eee3] border border-[#e4ddcf] text-xs font-sans text-[#16130f]">
              <span className="font-medium text-[#b8985f] uppercase tracking-wider text-[10px] block mb-1">
                Dispatch Courier Dispatch Note
              </span>
              <p className="whitespace-pre-line">{foundOrder.internalNotes}</p>
            </div>
          )}

          {/* Concierge Help */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#6f695f] font-sans">
            <span>Need prompt assistance?</span>
            <a
              href={`https://wa.me/923001234567?text=Inquiry%20regarding%20Order%20${foundOrder.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#b8985f] hover:text-[#16130f] font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
