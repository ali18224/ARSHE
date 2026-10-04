import React from 'react';
import { useStore } from '../context/StoreContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartShipping,
    cartTotal,
    freeShippingRemaining,
    settings,
    navigateTo,
  } = useStore();

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / settings.free_delivery_threshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f4eee3] flex items-center justify-center mx-auto mb-4 text-[#b8985f]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#16130f] mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans max-w-sm mx-auto mb-8 leading-relaxed">
          Discover our handcrafted Eau de Parfum fragrances, crafted in Lahore with genuine Taif rose and royal Cambodian oud.
        </p>
        <button
          onClick={() => navigateTo({ name: 'shop' })}
          className="bg-[#16130f] text-white hover:bg-[#b8985f] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
        >
          Explore Boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      <div className="mb-8 pb-4 border-b border-[#eee8da] flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
            Order Review
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#16130f] font-medium">
            Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#a39c91] hover:text-rose-600 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Clear entire bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="bg-[#f4eee3] p-4 border border-[#e4ddcf]">
            <div className="flex items-center justify-between text-xs font-sans mb-1.5">
              <span className="flex items-center gap-1.5 text-[#16130f] font-medium">
                <Truck className="w-4 h-4 text-[#b8985f]" />
                {freeShippingRemaining > 0 ? (
                  <span>
                    Add <strong>Rs. {freeShippingRemaining.toLocaleString('en-PK')}</strong> more for Complimentary Delivery
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold">
                    You have unlocked Complimentary Delivery across Pakistan!
                  </span>
                )}
              </span>
              <span className="text-[#6f695f] font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#e4ddcf] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#b8985f] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border border-[#eee8da] divide-y divide-[#eee8da]">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                {/* Image */}
                <div
                  onClick={() => navigateTo({ name: 'product', slug: item.slug })}
                  className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#f4eee3] border border-[#eee8da] shrink-0 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => navigateTo({ name: 'product', slug: item.slug })}
                        className="font-serif text-base sm:text-lg text-[#16130f] font-medium hover:text-[#b8985f] text-left truncate block"
                      >
                        {item.name}
                      </button>
                      <p className="text-xs text-[#6f695f] font-sans mt-0.5">{item.sizeLabel}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#a39c91] hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Price Row */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center border border-[#e4ddcf] bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-base font-semibold text-[#16130f]">
                        Rs. {(item.effectivePrice * item.quantity).toLocaleString('en-PK')}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-[#a39c91]">
                          Rs. {item.effectivePrice.toLocaleString('en-PK')} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigateTo({ name: 'shop' })}
            className="text-xs uppercase tracking-wider text-[#6f695f] hover:text-[#16130f] transition-colors inline-block pt-2"
          >
            ← Continue Browsing Fragrances
          </button>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-4 bg-white border border-[#eee8da] p-6 space-y-4">
          <h2 className="font-serif text-xl text-[#16130f] font-medium pb-3 border-b border-[#eee8da]">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs font-sans text-[#6f695f]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-[#16130f] font-mono">
                Rs. {cartSubtotal.toLocaleString('en-PK')}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping (Courier Pakistan)</span>
              <span className="font-medium text-[#16130f] font-mono">
                {cartShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">Free Express</span>
                ) : (
                  `Rs. ${cartShipping.toLocaleString('en-PK')}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment Option</span>
              <span className="font-medium text-[#16130f]">Cash on Delivery (COD)</span>
            </div>

            <div className="pt-3 border-t border-[#eee8da] flex justify-between text-sm">
              <span className="font-serif font-semibold text-[#16130f]">Total Payable</span>
              <span className="font-mono text-lg font-bold text-[#16130f]">
                Rs. {cartTotal.toLocaleString('en-PK')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo({ name: 'checkout' })}
            className="w-full bg-[#16130f] hover:bg-[#b8985f] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-[#eee8da] space-y-2 text-[11px] text-[#6f695f] font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b8985f]" />
              <span>Safe delivery with tamper-proof packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#b8985f]" />
              <span>Doorstep delivery via TCS / Leopards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
