import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartShipping,
    cartTotal,
    freeShippingRemaining,
    settings,
    navigateTo,
  } = useStore();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / settings.free_delivery_threshold) * 100)
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo({ name: 'checkout' });
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigateTo({ name: 'cart' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#fbf9f4] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#eee8da] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#b8985f]" />
            <h2 className="font-serif text-2xl text-[#16130f]">Your Shopping Bag</h2>
            <span className="text-xs text-[#6f695f] font-sans">({cart.length})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] transition-colors rounded-sm"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#f4eee3] px-5 py-3 border-b border-[#eee8da]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
            <span className="flex items-center gap-1.5 text-[#16130f] font-medium">
              <Truck className="w-3.5 h-3.5 text-[#b8985f]" />
              {freeShippingRemaining > 0 ? (
                <span>
                  Add <strong className="text-[#16130f]">Rs. {freeShippingRemaining.toLocaleString('en-PK')}</strong> more for Free Delivery
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold">
                  You unlocked Complimentary Express Delivery!
                </span>
              )}
            </span>
            <span className="text-[#6f695f]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#e4ddcf] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#b8985f] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#f4eee3] flex items-center justify-center mb-4 text-[#b8985f]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#16130f] mb-2">Your Bag is Empty</h3>
              <p className="text-sm text-[#6f695f] max-w-xs mb-6 font-sans">
                Discover ARSHÉ’s handcrafted perfumes made with Taif rose, Cambodian oud, and rare ambers.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo({ name: 'shop' });
                }}
                className="bg-[#16130f] text-[#fbf9f4] px-6 py-3 text-xs uppercase tracking-[0.18em] hover:bg-[#b8985f] transition-colors"
              >
                Explore Fragrances
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#eee8da]">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo({ name: 'product', slug: item.slug });
                    }}
                    className="relative w-20 h-24 bg-white border border-[#eee8da] shrink-0 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigateTo({ name: 'product', slug: item.slug });
                          }}
                          className="font-serif text-base text-[#16130f] font-medium hover:text-[#b8985f] text-left truncate"
                        >
                          {item.name}
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#a39c91] hover:text-rose-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#6f695f] mt-0.5">{item.sizeLabel}</p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-medium text-[#16130f]">
                          Rs. {item.effectivePrice.toLocaleString('en-PK')}
                        </span>
                        {item.salePrice && item.salePrice < item.unitPrice && (
                          <span className="text-xs text-[#a39c91] line-through">
                            Rs. {item.unitPrice.toLocaleString('en-PK')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#e4ddcf] bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-medium text-[#16130f]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-[#16130f] hover:bg-[#f4eee3] transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#16130f]">
                        Rs. {(item.effectivePrice * item.quantity).toLocaleString('en-PK')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#eee8da] space-y-3 font-sans">
            <div className="space-y-1.5 text-xs text-[#6f695f]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#16130f] font-medium">
                  Rs. {cartSubtotal.toLocaleString('en-PK')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-[#16130f] font-medium">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Free</span>
                  ) : (
                    `Rs. ${cartShipping.toLocaleString('en-PK')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#eee8da] text-sm font-serif">
                <span className="text-[#16130f] font-semibold">Estimated Total</span>
                <span className="text-base text-[#16130f] font-bold">
                  Rs. {cartTotal.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#16130f] text-[#fbf9f4] py-3.5 text-xs uppercase tracking-[0.18em] hover:bg-[#b8985f] transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span>Proceed to Checkout (COD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleViewCart}
              className="w-full border border-[#16130f] text-[#16130f] py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-[#f4eee3] transition-colors"
            >
              View Full Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
