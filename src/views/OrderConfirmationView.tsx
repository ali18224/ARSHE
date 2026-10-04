import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Truck, Phone, Package, ArrowRight } from 'lucide-react';

interface OrderConfirmationViewProps {
  orderNumber: string;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ orderNumber }) => {
  const { orders, navigateTo } = useStore();

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#16130f] mb-3">Order Receipt</h1>
        <p className="text-xs text-[#6f695f] mb-6">Could not find the requested order details.</p>
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="bg-[#16130f] text-white px-6 py-3 text-xs uppercase tracking-wider"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Top Banner */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium">
          Order Confirmed
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16130f] font-medium">
          Thank You, {order.customerName}
        </h1>
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans max-w-md mx-auto leading-relaxed">
          Your order has been recorded in our Lahore atelier. Our concierge will prepare and dispatch your fragrance flacon safely.
        </p>
      </div>

      {/* Order Card */}
      <div className="bg-white border border-[#eee8da] p-6 sm:p-8 space-y-6">
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#eee8da]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#a39c91] block font-sans">
              Order Number
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#16130f]">
              {order.orderNumber}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#a39c91] block font-sans">
              Status
            </span>
            <span className="inline-block bg-[#f4eee3] text-[#b8985f] border border-[#e4ddcf] text-xs uppercase tracking-wider px-3 py-1 font-sans font-medium">
              {order.status}
            </span>
          </div>
        </div>

        {/* Itemized list */}
        <div>
          <h3 className="font-serif text-lg text-[#16130f] font-medium mb-3">
            Purchased Fragrances
          </h3>
          <div className="divide-y divide-[#eee8da]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-[#f4eee3] border border-[#eee8da] shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.nameSnapshot} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-medium text-[#16130f]">
                      {item.nameSnapshot}
                    </p>
                    <p className="text-[11px] text-[#6f695f]">
                      {item.sizeLabel} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-mono font-medium text-sm text-[#16130f]">
                  Rs. {item.lineTotal.toLocaleString('en-PK')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-[#eee8da] space-y-2 text-xs font-sans text-[#6f695f]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-[#16130f]">
              Rs. {order.subtotal.toLocaleString('en-PK')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono text-[#16130f]">
              {order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString('en-PK')}`}
            </span>
          </div>
          <div className="pt-2 border-t border-[#eee8da] flex justify-between text-base">
            <span className="font-serif font-semibold text-[#16130f]">Amount Payable on Delivery</span>
            <span className="font-mono font-bold text-lg text-[#16130f]">
              Rs. {order.total.toLocaleString('en-PK')}
            </span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="pt-4 border-t border-[#eee8da] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#6f695f]">
          <div>
            <p className="font-medium text-[#16130f] uppercase tracking-wider text-[11px] mb-1">
              Delivery Address
            </p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.province} {order.postalCode}
            </p>
          </div>
          <div>
            <p className="font-medium text-[#16130f] uppercase tracking-wider text-[11px] mb-1">
              Recipient & Payment
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#b8985f]" /> {order.phone}
            </p>
            <p className="mt-1">
              Payment: <strong className="text-[#16130f]">Cash on Delivery (COD)</strong>
            </p>
            {order.notes && <p className="mt-1 italic">Note: "{order.notes}"</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigateTo({ name: 'track-order' })}
          className="w-full sm:w-auto bg-[#16130f] hover:bg-[#b8985f] text-white px-8 py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Status</span>
        </button>
        <button
          onClick={() => navigateTo({ name: 'shop' })}
          className="w-full sm:w-auto border border-[#16130f] text-[#16130f] hover:bg-[#16130f] hover:text-white px-8 py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
