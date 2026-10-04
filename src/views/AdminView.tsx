import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { OrderStatus, Product } from '../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Warehouse,
  Star,
  Settings as SettingsIcon,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Search,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Lock,
  LogOut,
  User,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AdminViewProps {
  subview?: 'dashboard' | 'orders' | 'products' | 'inventory' | 'reviews' | 'homepage' | 'settings';
}

export const AdminView: React.FC<AdminViewProps> = ({ subview = 'dashboard' }) => {
  const {
    orders,
    updateOrderStatus,
    products,
    updateProductStock,
    saveProduct,
    deleteProduct,
    reviews,
    toggleReviewApproval,
    deleteReview,
    settings,
    updateSettings,
    homepageContent,
    updateHomepageContent,
    navigateTo,
    showToast,
    isAdminAuthenticated,
    adminUser,
    adminLogin,
    adminLogout,
    changeAdminCredentials,
    setCustomAdminCredentials,
  } = useStore();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Direct custom credentials setter on login screen
  const [isSettingCustomCreds, setIsSettingCustomCreds] = useState(false);
  const [customUser, setCustomUser] = useState('');
  const [customPass, setCustomPass] = useState('');
  const [customPassConfirm, setCustomPassConfirm] = useState('');
  const [customCredError, setCustomCredError] = useState<string | null>(null);

  // Change credentials state in Settings
  const [currentPw, setCurrentPw] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'inventory' | 'reviews' | 'homepage' | 'settings'>(
    subview
  );

  // Orders filter & search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Editing product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Local settings & homepage form
  const [localSettings, setLocalSettings] = useState(settings);
  const [localHero, setLocalHero] = useState(homepageContent.hero);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = adminLogin(loginUsername, loginPassword);
    if (!result.ok) {
      setLoginError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleCustomCredsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomCredError(null);
    if (!customPass) {
      setCustomCredError('Please enter a password.');
      return;
    }
    if (customPass.length < 8) {
      setCustomCredError('Password must be at least 8 characters.');
      return;
    }
    if (customPass !== customPassConfirm) {
      setCustomCredError('Passwords do not match.');
      return;
    }
    setCustomAdminCredentials(customUser.trim() || 'owner', customPass);
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (newPw && newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }

    const res = changeAdminCredentials(
      currentPw,
      newUsername.trim() || undefined,
      newPw || undefined
    );

    if (res.ok) {
      setPwSuccess('Admin credentials updated successfully! You can use these next time you log in.');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      setPwError(res.error || 'Failed to update credentials.');
    }
  };

  // If unauthenticated, show the secure Admin Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#16130f] text-[#fbf9f4] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#28241f] border border-[#b8985f]/30 p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#16130f] border border-[#b8985f]/50 text-[#c9ad78] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <span className="font-serif text-3xl tracking-[0.24em] font-normal text-white block">
              ARSHÉ
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9ad78] font-sans">
              Admin Security Console
            </p>
            <p className="text-xs text-[#a39c91] font-sans leading-relaxed pt-1">
              Authorized personnel only. Please sign in with your admin credentials to manage boutique operations, catalog, and customer orders.
            </p>
          </div>

          {loginError && !isSettingCustomCreds && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {customCredError && isSettingCustomCreds && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{customCredError}</span>
            </div>
          )}

          {!isSettingCustomCreds ? (
            /* 1. STANDARD SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c9ad78] mb-1.5 font-medium">
                  Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-9 pr-3 py-3 bg-[#16130f] border border-[#b8985f]/40 text-white placeholder:text-[#6f695f] focus:outline-none focus:border-[#c9ad78]"
                  />
                  <User className="w-4 h-4 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c9ad78] mb-1.5 font-medium">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-3 bg-[#16130f] border border-[#b8985f]/40 text-white placeholder:text-[#6f695f] focus:outline-none focus:border-[#c9ad78]"
                  />
                  <KeyRound className="w-4 h-4 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a39c91] hover:text-white cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#b8985f] hover:bg-[#c9ad78] text-[#16130f] font-semibold py-3.5 text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer shadow-md"
              >
                Sign In to Console
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsSettingCustomCreds(true)}
                  className="text-[11px] text-[#c9ad78] hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Set or Reset Your Custom Password & Username →
                </button>
              </div>
            </form>
          ) : (
            /* 2. CUSTOM CREDENTIALS SETUP FORM */
            <form onSubmit={handleCustomCredsSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#16130f] border border-[#b8985f]/30 text-[#e4ddcf] text-[11px] leading-relaxed">
                <strong className="text-[#c9ad78] block mb-1">Set Your Custom Admin Credentials:</strong>
                Choose your preferred username and password below. They will be saved to your browser and you will be signed in instantly.
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c9ad78] mb-1.5 font-medium">
                  Desired Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={customUser}
                    onChange={(e) => setCustomUser(e.target.value)}
                    placeholder="e.g. owner or your name"
                    className="w-full pl-9 pr-3 py-3 bg-[#16130f] border border-[#b8985f]/40 text-white placeholder:text-[#6f695f] focus:outline-none focus:border-[#c9ad78]"
                  />
                  <User className="w-4 h-4 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c9ad78] mb-1.5 font-medium">
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={customPass}
                    onChange={(e) => setCustomPass(e.target.value)}
                    placeholder="Enter your new custom password"
                    className="w-full pl-9 pr-3 py-3 bg-[#16130f] border border-[#b8985f]/40 text-white placeholder:text-[#6f695f] focus:outline-none focus:border-[#c9ad78]"
                  />
                  <KeyRound className="w-4 h-4 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c9ad78] mb-1.5 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={customPassConfirm}
                    onChange={(e) => setCustomPassConfirm(e.target.value)}
                    placeholder="Re-type your new custom password"
                    className="w-full pl-9 pr-3 py-3 bg-[#16130f] border border-[#b8985f]/40 text-white placeholder:text-[#6f695f] focus:outline-none focus:border-[#c9ad78]"
                  />
                  <KeyRound className="w-4 h-4 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#b8985f] hover:bg-[#c9ad78] text-[#16130f] font-semibold py-3.5 text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer shadow-md"
              >
                Save Credentials & Sign In
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsSettingCustomCreds(false)}
                  className="text-[11px] text-[#a39c91] hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Standard Sign In
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigateTo({ name: 'home' })}
              className="text-xs text-[#a39c91] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'returned')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const pendingReviews = reviews.filter((r) => !r.approved);

  const ORDER_STATUSES: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'returned',
  ];

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageContent({ hero: localHero });
  };

  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    saveProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="bg-[#f4eee3] min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with back to storefront */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-5 border border-[#eee8da]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-light tracking-[0.24em] text-[#16130f]">
                ARSHÉ
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] bg-[#16130f] text-[#c9ad78] px-2 py-0.5 font-medium">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-[#6f695f] font-sans mt-0.5">
              Store operations, inventory, orders, and customer reviews
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#6f695f] font-sans flex items-center gap-1.5 bg-[#fbf9f4] border border-[#e4ddcf] px-3 py-1.5">
              <User className="w-3.5 h-3.5 text-[#b8985f]" />
              <span>User: <strong className="text-[#16130f] font-mono">{adminUser?.username || 'owner'}</strong></span>
            </span>

            <button
              onClick={adminLogout}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-rose-700 hover:text-white hover:bg-rose-700 border border-rose-300 px-3 py-1.5 font-medium transition-colors cursor-pointer"
              title="Sign out of Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'home' })}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#16130f] hover:text-[#b8985f] border border-[#e4ddcf] px-3.5 py-1.5 font-medium bg-[#fbf9f4] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>
        </div>

        {/* Tab navigation bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 text-xs font-sans">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'inventory', label: 'Stock & Inventory', icon: Warehouse },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'homepage', label: 'Homepage Content', icon: Home },
            { id: 'settings', label: 'Store Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 flex items-center gap-2 shrink-0 border uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#16130f] text-white border-[#16130f]'
                    : 'bg-white text-[#6f695f] border-[#e4ddcf] hover:border-[#16130f] hover:text-[#16130f]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 border border-[#eee8da] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#a39c91] font-sans block">
                  Total Revenue (COD)
                </span>
                <p className="font-mono text-2xl font-bold text-[#16130f]">
                  Rs. {totalRevenue.toLocaleString('en-PK')}
                </p>
                <p className="text-[11px] text-[#b8985f] font-sans">Active orders processed</p>
              </div>

              <div className="bg-white p-5 border border-[#eee8da] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#a39c91] font-sans block">
                  Pending Orders
                </span>
                <p className="font-mono text-2xl font-bold text-[#16130f]">
                  {pendingOrders.length}
                </p>
                <p className="text-[11px] text-amber-700 font-sans">Awaiting courier dispatch</p>
              </div>

              <div className="bg-white p-5 border border-[#eee8da] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#a39c91] font-sans block">
                  Low Stock Flacons
                </span>
                <p className="font-mono text-2xl font-bold text-rose-700">
                  {lowStockProducts.length}
                </p>
                <p className="text-[11px] text-rose-600 font-sans">Need replenishment</p>
              </div>

              <div className="bg-white p-5 border border-[#eee8da] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#a39c91] font-sans block">
                  Pending Reviews
                </span>
                <p className="font-mono text-2xl font-bold text-[#16130f]">
                  {pendingReviews.length}
                </p>
                <p className="text-[11px] text-[#6f695f] font-sans">Customer submissions</p>
              </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white p-6 border border-[#eee8da]">
                <div className="flex items-center justify-between pb-3 border-b border-[#eee8da] mb-4">
                  <h3 className="font-serif text-lg text-[#16130f] font-medium">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#b8985f] hover:underline"
                  >
                    View all ({orders.length})
                  </button>
                </div>

                <div className="divide-y divide-[#eee8da] max-h-80 overflow-y-auto">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between text-xs font-sans">
                      <div>
                        <p className="font-mono font-medium text-[#16130f]">{o.orderNumber}</p>
                        <p className="text-[#6f695f]">
                          {o.customerName} · {o.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold text-[#16130f]">
                          Rs. {o.total.toLocaleString('en-PK')}
                        </p>
                        <span className="text-[10px] uppercase tracking-wider text-[#b8985f]">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning */}
              <div className="bg-white p-6 border border-[#eee8da]">
                <div className="flex items-center justify-between pb-3 border-b border-[#eee8da] mb-4">
                  <h3 className="font-serif text-lg text-[#16130f] font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Low Stock Flacons</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs text-[#b8985f] hover:underline"
                  >
                    Adjust stock
                  </button>
                </div>

                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-emerald-700 py-6 text-center font-sans">
                    All perfume inventory levels are well-stocked.
                  </p>
                ) : (
                  <div className="divide-y divide-[#eee8da]">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs font-sans">
                        <div>
                          <p className="font-serif text-sm font-medium text-[#16130f]">{p.name}</p>
                          <p className="text-[#6f695f]">{p.fragranceFamily} series</p>
                        </div>
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 font-mono font-medium">
                          {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-[#eee8da]">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search by order #, customer, or phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#fbf9f4] border border-[#e4ddcf] text-xs font-sans focus:outline-none focus:border-[#b8985f]"
                />
                <Search className="w-3.5 h-3.5 text-[#a39c91] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto text-xs font-sans">
                <span className="text-[#a39c91] shrink-0">Filter Status:</span>
                <button
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1.5 border text-xs cursor-pointer ${
                    orderStatusFilter === 'all'
                      ? 'bg-[#16130f] text-white border-[#16130f]'
                      : 'border-[#e4ddcf]'
                  }`}
                >
                  All ({orders.length})
                </button>
                {ORDER_STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 border text-xs capitalize cursor-pointer shrink-0 ${
                      orderStatusFilter === st
                        ? 'bg-[#16130f] text-white border-[#16130f]'
                        : 'border-[#e4ddcf]'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#eee8da] text-[#a39c91] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Customer & Phone</th>
                    <th className="py-3 px-2">City & Address</th>
                    <th className="py-3 px-2">Items</th>
                    <th className="py-3 px-2">Total (COD)</th>
                    <th className="py-3 px-2">Current Status</th>
                    <th className="py-3 px-2 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8da]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#a39c91]">
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#fbf9f4] transition-colors">
                        <td className="py-3 px-2 font-mono font-medium text-[#16130f]">
                          {o.orderNumber}
                          <span className="block text-[10px] text-[#a39c91] font-sans">
                            {new Date(o.createdAt).toLocaleDateString('en-PK')}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-[#16130f]">{o.customerName}</p>
                          <p className="text-[#6f695f] font-mono">{o.phone}</p>
                        </td>
                        <td className="py-3 px-2 max-w-xs">
                          <p className="font-medium text-[#16130f]">{o.city}, {o.province}</p>
                          <p className="text-[11px] text-[#6f695f] truncate">{o.address}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-mono">{o.items.reduce((s, i) => s + i.quantity, 0)} flacons</span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-[#16130f]">
                          Rs. {o.total.toLocaleString('en-PK')}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium ${
                              o.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : o.status === 'shipped' || o.status === 'out_for_delivery'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : o.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-[#f4eee3] text-[#b8985f] border border-[#e4ddcf]'
                            }`}
                          >
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="p-1.5 border border-[#e4ddcf] bg-white text-xs text-[#16130f] cursor-pointer"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                Mark as {st.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. STOCK & INVENTORY QUICK-ADJUST */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <div className="pb-3 border-b border-[#eee8da]">
              <h3 className="font-serif text-xl text-[#16130f] font-medium">
                Live Stock & Inventory Controller
              </h3>
              <p className="text-xs text-[#6f695f] font-sans">
                Directly edit flacon units available for sale. Updates reflect in real time on PDPs and cart limits.
              </p>
            </div>

            <div className="divide-y divide-[#eee8da]">
              {products.map((p) => (
                <div key={p.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base text-[#16130f] font-medium">{p.name}</h4>
                      <p className="text-[11px] text-[#6f695f] font-sans">
                        SKU: {p.sku || 'N/A'} · Family: {p.fragranceFamily}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6f695f] font-sans">Base Stock:</span>
                      <input
                        type="number"
                        value={p.stock}
                        onChange={(e) => updateProductStock(p.id, null, Number(e.target.value) || 0)}
                        className={`w-20 p-1.5 border text-center font-mono text-xs ${
                          p.stock <= 5 ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-[#e4ddcf]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Sizes stock */}
                  {p.sizes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-4 border-l-2 border-[#b8985f]/30">
                      {p.sizes.map((sz) => (
                        <div key={sz.id} className="flex items-center justify-between bg-[#fbf9f4] p-2 border border-[#eee8da] text-xs font-sans">
                          <span>{sz.label}</span>
                          <input
                            type="number"
                            value={sz.stock}
                            onChange={(e) => updateProductStock(p.id, sz.id, Number(e.target.value) || 0)}
                            className="w-16 p-1 border border-[#e4ddcf] bg-white text-center font-mono text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PRODUCTS CATALOG EDITOR */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee8da]">
              <div>
                <h3 className="font-serif text-xl text-[#16130f] font-medium">
                  Fragrance Catalog ({products.length})
                </h3>
                <p className="text-xs text-[#6f695f] font-sans">
                  Manage product pricing, fragrance notes, and marketing flags.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#eee8da]">
              {products.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-[#f4eee3] border border-[#eee8da] shrink-0 overflow-hidden">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[#16130f] font-medium">{p.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-sans text-[#6f695f]">
                        <span className="font-mono">Rs. {p.basePrice.toLocaleString('en-PK')}</span>
                        {p.salePrice && (
                          <span className="text-emerald-700 font-mono">(Sale: Rs. {p.salePrice.toLocaleString('en-PK')})</span>
                        )}
                        <span>·</span>
                        <span className="capitalize">{p.fragranceFamily}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct({ ...p })}
                      className="border border-[#16130f] px-3.5 py-1.5 text-xs uppercase tracking-wider text-[#16130f] hover:bg-[#16130f] hover:text-white transition-colors cursor-pointer"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => navigateTo({ name: 'product', slug: p.slug })}
                      className="border border-[#e4ddcf] px-3 py-1.5 text-xs text-[#6f695f] hover:text-[#16130f] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eee8da]">
                    <h3 className="font-serif text-2xl text-[#16130f]">Edit {editingProduct.name}</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-xs text-[#a39c91] hover:text-[#16130f]">
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleProductSave} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                          Fragrance Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full p-2.5 border border-[#e4ddcf]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                          Base Price (PKR)
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.basePrice}
                          onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) || 0 })}
                          className="w-full p-2.5 border border-[#e4ddcf] font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                          Sale Price (PKR, or empty)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.salePrice || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : null })}
                          className="w-full p-2.5 border border-[#e4ddcf] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) || 0 })}
                          className="w-full p-2.5 border border-[#e4ddcf] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={editingProduct.shortDescription}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                        className="w-full p-2.5 border border-[#e4ddcf]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Top Notes
                      </label>
                      <input
                        type="text"
                        value={editingProduct.topNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, topNotes: e.target.value })}
                        className="w-full p-2.5 border border-[#e4ddcf]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Heart Notes
                      </label>
                      <input
                        type="text"
                        value={editingProduct.heartNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, heartNotes: e.target.value })}
                        className="w-full p-2.5 border border-[#e4ddcf]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1">
                        Base Notes
                      </label>
                      <input
                        type="text"
                        value={editingProduct.baseNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, baseNotes: e.target.value })}
                        className="w-full p-2.5 border border-[#e4ddcf]"
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isBestSeller}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                          className="accent-[#b8985f]"
                        />
                        <span>Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isNewArrival}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                          className="accent-[#b8985f]"
                        />
                        <span>New Arrival</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                          className="accent-[#b8985f]"
                        />
                        <span>Featured Masterwork</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-[#eee8da]">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-[#e4ddcf] text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-2 text-xs uppercase tracking-wider font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <div className="pb-3 border-b border-[#eee8da]">
              <h3 className="font-serif text-xl text-[#16130f] font-medium">
                Customer Reviews Moderation ({reviews.length})
              </h3>
              <p className="text-xs text-[#6f695f] font-sans">
                Approve authentic customer reviews to display on the storefront, or remove spam.
              </p>
            </div>

            <div className="divide-y divide-[#eee8da]">
              {reviews.map((rev) => {
                const product = products.find((p) => p.id === rev.productId);
                return (
                  <div key={rev.id} className="py-4 space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#16130f]">{rev.name}</span>
                        <span className="text-[#a39c91]">· {product?.name || 'Fragrance'}</span>
                        <span className="text-[#b8985f] font-mono">({rev.rating} ★)</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-medium ${
                          rev.approved ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {rev.approved ? 'Approved' : 'Pending Moderation'}
                      </span>
                    </div>

                    {rev.title && <p className="font-medium text-[#16130f]">"{rev.title}"</p>}
                    <p className="text-[#6f695f]">{rev.body}</p>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => toggleReviewApproval(rev.id)}
                        className="border border-[#16130f] px-3 py-1 text-[11px] uppercase tracking-wider hover:bg-[#16130f] hover:text-white transition-colors cursor-pointer"
                      >
                        {rev.approved ? 'Revoke Approval' : 'Approve Review'}
                      </button>
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="text-rose-600 hover:underline px-2 py-1 text-[11px] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. HOMEPAGE CONTENT EDITOR */}
        {activeTab === 'homepage' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-4">
            <div className="pb-3 border-b border-[#eee8da]">
              <h3 className="font-serif text-xl text-[#16130f] font-medium">
                Homepage Hero & Editorial Editor
              </h3>
              <p className="text-xs text-[#6f695f] font-sans">
                Customize main promotional slogans and narrative copy.
              </p>
            </div>

            <form onSubmit={handleSaveHomepage} className="space-y-4 text-xs font-sans max-w-xl">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                  Hero Eyebrow Label
                </label>
                <input
                  type="text"
                  value={localHero.eyebrow}
                  onChange={(e) => setLocalHero({ ...localHero, eyebrow: e.target.value })}
                  className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={localHero.heading}
                  onChange={(e) => setLocalHero({ ...localHero, heading: e.target.value })}
                  className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={localHero.description}
                  onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
                  className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-3 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Homepage Copy</span>
              </button>
            </form>
          </div>
        )}

        {/* 7. STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#eee8da] p-6 space-y-6">
            <div className="pb-3 border-b border-[#eee8da]">
              <h3 className="font-serif text-xl text-[#16130f] font-medium">
                Store Settings & Delivery Parameters
              </h3>
              <p className="text-xs text-[#6f695f] font-sans">
                Manage Pakistani shipping fees, announcement text, WhatsApp number, and store policies.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-sans max-w-2xl">
              {/* Announcement */}
              <div className="space-y-3 bg-[#fbf9f4] p-4 border border-[#e4ddcf]">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#16130f]">
                  <input
                    type="checkbox"
                    checked={localSettings.announcement_enabled}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, announcement_enabled: e.target.checked })
                    }
                    className="accent-[#b8985f]"
                  />
                  <span>Enable Top Announcement Bar</span>
                </label>
                <input
                  type="text"
                  value={localSettings.announcement_text}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, announcement_text: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-[#e4ddcf]"
                />
              </div>

              {/* Shipping Thresholds */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                    Free Delivery Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={localSettings.free_delivery_threshold}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        free_delivery_threshold: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                    Flat Delivery Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={localSettings.shipping_flat}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        shipping_flat: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] font-mono"
                  />
                </div>
              </div>

              {/* Contact information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    value={localSettings.phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                    WhatsApp Concierge
                  </label>
                  <input
                    type="text"
                    value={localSettings.whatsapp}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                  Atelier Address
                </label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                  className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-3 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Store Settings</span>
              </button>
            </form>

            {/* Admin Security: Change Username & Password */}
            <div className="pt-8 border-t border-[#eee8da] space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#b8985f]" />
                <h3 className="font-serif text-xl text-[#16130f] font-medium">
                  Admin Security & Credentials
                </h3>
              </div>
              <p className="text-xs text-[#6f695f] font-sans">
                Update your login username and password. Changes take effect immediately and are securely saved for all future admin sessions.
              </p>

              {pwSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              {pwError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}

              <form onSubmit={handleChangeCredentials} className="space-y-4 max-w-xl text-xs font-sans">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                    Current Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                      New Username (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. owner or admin"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                      New Password (8+ chars)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                    />
                  </div>
                </div>

                {newPw && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6f695f] mb-1 font-medium">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-type new password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full p-2.5 bg-[#fbf9f4] border border-[#e4ddcf] focus:outline-none focus:border-[#b8985f]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-[#16130f] hover:bg-[#b8985f] text-white px-6 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  Update Admin Credentials
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
