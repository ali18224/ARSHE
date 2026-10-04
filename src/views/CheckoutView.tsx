import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAKISTANI_PROVINCES, PAKISTANI_MAJOR_CITIES } from '../data/initialData';
import { Banknote, ShieldCheck, ArrowRight, Truck, AlertCircle } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, cartSubtotal, cartShipping, cartTotal, placeOrder, navigateTo, showToast } =
    useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#16130f] mb-3">Your Bag is Empty</h1>
        <p className="text-xs text-[#6f695f] mb-6 font-sans">
          You need items in your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo({ name: 'shop' })}
          className="bg-[#16130f] text-white px-6 py-3 text-xs uppercase tracking-wider"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const validatePhone = (phoneStr: string) => {
    const clean = phoneStr.replace(/\D/g, '');
    return clean.length >= 10 && clean.length <= 13;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please enter a valid Pakistani phone number (e.g. 0300-1234567).');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Please provide your complete delivery address.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = placeOrder({
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        province: formData.province,
        postalCode: formData.postalCode.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      showToast(`Order #${order.orderNumber} placed successfully!`, 'success');
      navigateTo({ name: 'order-confirmation', orderNumber: order.orderNumber });
    } catch {
      setErrorMsg('An error occurred while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      {/* Title */}
      <div className="mb-8 pb-4 border-b border-[#eee8da]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
          Cash on Delivery
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#16130f] font-medium">
          Express Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Contact Information */}
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#16130f] font-medium pb-2 border-b border-[#eee8da]">
              1. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Qureshi"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Mobile Phone (03xx-xxxxxxx) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Email Address (optional, for digital receipt)
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#16130f] font-medium pb-2 border-b border-[#eee8da]">
              2. Delivery Address
            </h2>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Street Address / House / Apartment / Sector *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. House 14, Street 7, Block B, DHA Phase 5"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  >
                    {PAKISTANI_MAJOR_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  >
                    {PAKISTANI_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                    Postal Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54000"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1.5 font-medium">
                  Delivery Notes / Landmarks (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near commercial market, call upon arrival"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#16130f] font-medium pb-2 border-b border-[#eee8da]">
              3. Payment Method
            </h2>

            <div className="border border-[#b8985f] bg-[#f4eee3] p-4 flex items-start gap-3">
              <Banknote className="w-5 h-5 text-[#b8985f] shrink-0 mt-0.5" />
              <div className="text-xs font-sans">
                <p className="font-semibold text-[#16130f] text-sm">
                  Cash on Delivery (COD)
                </p>
                <p className="text-[#6f695f] mt-1 leading-relaxed">
                  Pay securely in cash directly to the courier agent when your package arrives at your doorstep. No advance card payment needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#eee8da] p-6 space-y-4 sticky top-28">
            <h3 className="font-serif text-xl text-[#16130f] font-medium pb-3 border-b border-[#eee8da]">
              Your Selection ({cart.length})
            </h3>

            {/* Items list */}
            <div className="divide-y divide-[#eee8da] max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 text-xs font-sans">
                  <div className="w-14 h-16 bg-[#f4eee3] shrink-0 overflow-hidden border border-[#eee8da]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-medium text-[#16130f] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#6f695f]">{item.sizeLabel}</p>
                    <p className="text-[11px] text-[#a39c91]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-mono font-medium text-[#16130f]">
                    Rs. {(item.effectivePrice * item.quantity).toLocaleString('en-PK')}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-[#eee8da] space-y-2 text-xs font-sans text-[#6f695f]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#16130f]">
                  Rs. {cartSubtotal.toLocaleString('en-PK')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono text-[#16130f]">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Free Express</span>
                  ) : (
                    `Rs. ${cartShipping.toLocaleString('en-PK')}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-[#eee8da] flex justify-between text-base">
                <span className="font-serif font-semibold text-[#16130f]">Total Due (COD)</span>
                <span className="font-mono font-bold text-[#16130f] text-lg">
                  Rs. {cartTotal.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#16130f] hover:bg-[#b8985f] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Placing Your Order...' : 'Confirm Order via COD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-[#eee8da] space-y-1.5 text-[11px] text-[#6f695f] font-sans">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#b8985f]" />
                <span>Estimated dispatch within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b8985f]" />
                <span>Customer service confirms all orders prior to shipment</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
