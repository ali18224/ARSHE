import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  Category,
  Collection,
  Review,
  Order,
  CartItem,
  SiteSettings,
  HomepageContent,
  ActivePage,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_HOMEPAGE_CONTENT,
} from '../data/initialData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation
  activePage: ActivePage;
  navigateTo: (page: ActivePage) => void;
  goBack: () => void;

  // Catalog
  products: Product[];
  categories: Category[];
  collections: Collection[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: number) => Product | undefined;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, sizeId?: number | null, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartShipping: number;
  cartTotal: number;
  freeShippingRemaining: number;
  itemCount: number;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Orders
  orders: Order[];
  placeOrder: (data: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    notes?: string;
  }) => Order;
  findOrder: (orderNumber: string, phone: string) => Order | undefined;
  updateOrderStatus: (orderId: number, status: OrderStatus, note?: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (data: {
    productId: number;
    name: string;
    email?: string;
    rating: number;
    title?: string;
    body: string;
  }) => void;
  toggleReviewApproval: (reviewId: number) => void;
  deleteReview: (reviewId: number) => void;

  // Inventory & Products Admin
  updateProductStock: (productId: number, sizeId: number | null, newStock: number) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;

  // Settings & Content
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  homepageContent: HomepageContent;
  updateHomepageContent: (newContent: Partial<HomepageContent>) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Search Query global
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: { username: string; role: string } | null;
  adminLogin: (username: string, password: string) => { ok: boolean; error?: string };
  adminLogout: () => void;
  changeAdminCredentials: (
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ) => { ok: boolean; error?: string };
  setCustomAdminCredentials: (username: string, password: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(`arsh_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`arsh_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Route state
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('shop')) {
        const query = hash.split('?')[1];
        const params = new URLSearchParams(query || '');
        return {
          name: 'shop',
          params: {
            category: params.get('category') || undefined,
            family: params.get('family') || undefined,
            gender: params.get('gender') || undefined,
            q: params.get('q') || undefined,
          },
        };
      }
      if (hash.startsWith('product/')) {
        return { name: 'product', slug: hash.replace('product/', '') };
      }
      if (hash.startsWith('collection/')) {
        return { name: 'collection', slug: hash.replace('collection/', '') };
      }
      if (hash === 'collections') return { name: 'collections' };
      if (hash === 'cart') return { name: 'cart' };
      if (hash === 'checkout') return { name: 'checkout' };
      if (hash.startsWith('order/')) {
        return { name: 'order-confirmation', orderNumber: hash.replace('order/', '') };
      }
      if (hash === 'track') return { name: 'track-order' };
      if (hash === 'wishlist') return { name: 'wishlist' };
      if (hash === 'about') return { name: 'about' };
      if (hash === 'contact') return { name: 'contact' };
      if (hash === 'faq') return { name: 'faq' };
      if (hash === 'boutiques') return { name: 'boutiques' };
      if (hash === 'studio') return { name: 'studio' };
      if (hash === 'animator') return { name: 'animator' };
      if (hash.startsWith('policy/')) {
        const slug = hash.replace('policy/', '') as 'shipping' | 'returns' | 'privacy' | 'terms';
        return { name: 'policy', slug };
      }
      if (hash.startsWith('admin')) {
        const sub = hash.split('/')[1] as any;
        return { name: 'admin', subview: sub || 'dashboard' };
      }
    }
    return { name: 'home' };
  });

  // History stack for goBack
  const [historyStack, setHistoryStack] = useState<ActivePage[]>([]);

  // Catalog State
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('products', INITIAL_PRODUCTS)
  );
  const [categories] = useState<Category[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [collections] = useState<Collection[]>(() =>
    loadFromStorage('collections', INITIAL_COLLECTIONS)
  );

  // Cart & Drawer State
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<number[]>(() => loadFromStorage('wishlist', []));

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('orders', INITIAL_ORDERS));

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage('reviews', INITIAL_REVIEWS)
  );

  // Settings & Content
  const [settings, setSettings] = useState<SiteSettings>(() =>
    loadFromStorage('settings', INITIAL_SETTINGS)
  );
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() =>
    loadFromStorage('homepage_content', INITIAL_HOMEPAGE_CONTENT)
  );

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Authentication State
  const [adminCreds, setAdminCreds] = useState<{ username: string; password: string }>(() =>
    loadFromStorage('admin_creds', {
      username: 'owner',
      password: 'ChangeMe12345!',
    })
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadFromStorage('admin_session', false)
  );
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(() =>
    loadFromStorage('admin_user', null)
  );
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);

  // Sync to storage
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('cart', cart), [cart]);
  useEffect(() => saveToStorage('wishlist', wishlist), [wishlist]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('homepage_content', homepageContent), [homepageContent]);
  useEffect(() => saveToStorage('admin_creds', adminCreds), [adminCreds]);
  useEffect(() => saveToStorage('admin_session', isAdminAuthenticated), [isAdminAuthenticated]);
  useEffect(() => saveToStorage('admin_user', adminUser), [adminUser]);

  // Sync URL hash
  useEffect(() => {
    let hash = '';
    if (activePage.name === 'home') hash = '';
    else if (activePage.name === 'shop') {
      const p = activePage.params;
      const q = new URLSearchParams();
      if (p?.category) q.set('category', p.category);
      if (p?.family) q.set('family', p.family);
      if (p?.gender) q.set('gender', p.gender);
      if (p?.q) q.set('q', p.q);
      const str = q.toString();
      hash = str ? `shop?${str}` : 'shop';
    } else if (activePage.name === 'product') {
      hash = `product/${activePage.slug}`;
    } else if (activePage.name === 'collections') {
      hash = 'collections';
    } else if (activePage.name === 'collection') {
      hash = `collection/${activePage.slug}`;
    } else if (activePage.name === 'cart') {
      hash = 'cart';
    } else if (activePage.name === 'checkout') {
      hash = 'checkout';
    } else if (activePage.name === 'order-confirmation') {
      hash = `order/${activePage.orderNumber}`;
    } else if (activePage.name === 'track-order') {
      hash = 'track';
    } else if (activePage.name === 'wishlist') {
      hash = 'wishlist';
    } else if (activePage.name === 'about') {
      hash = 'about';
    } else if (activePage.name === 'contact') {
      hash = 'contact';
    } else if (activePage.name === 'faq') {
      hash = 'faq';
    } else if (activePage.name === 'boutiques') {
      hash = 'boutiques';
    } else if (activePage.name === 'studio') {
      hash = 'studio';
    } else if (activePage.name === 'animator') {
      hash = 'animator';
    } else if (activePage.name === 'policy') {
      hash = `policy/${activePage.slug}`;
    } else if (activePage.name === 'admin') {
      hash = activePage.subview ? `admin/${activePage.subview}` : 'admin';
    }

    if (typeof window !== 'undefined') {
      const target = hash ? `#${hash}` : window.location.pathname;
      if (window.location.hash !== (hash ? `#${hash}` : '')) {
        window.history.pushState(null, '', target);
      }
    }
  }, [activePage]);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setActivePage({ name: 'home' });
      } else if (hash.startsWith('shop')) {
        const query = hash.split('?')[1];
        const params = new URLSearchParams(query || '');
        setActivePage({
          name: 'shop',
          params: {
            category: params.get('category') || undefined,
            family: params.get('family') || undefined,
            gender: params.get('gender') || undefined,
            q: params.get('q') || undefined,
          },
        });
      } else if (hash.startsWith('product/')) {
        setActivePage({ name: 'product', slug: hash.replace('product/', '') });
      } else if (hash.startsWith('collection/')) {
        setActivePage({ name: 'collection', slug: hash.replace('collection/', '') });
      } else if (hash === 'collections') {
        setActivePage({ name: 'collections' });
      } else if (hash === 'cart') {
        setActivePage({ name: 'cart' });
      } else if (hash === 'checkout') {
        setActivePage({ name: 'checkout' });
      } else if (hash.startsWith('order/')) {
        setActivePage({ name: 'order-confirmation', orderNumber: hash.replace('order/', '') });
      } else if (hash === 'track') {
        setActivePage({ name: 'track-order' });
      } else if (hash === 'wishlist') {
        setActivePage({ name: 'wishlist' });
      } else if (hash === 'about') {
        setActivePage({ name: 'about' });
      } else if (hash === 'contact') {
        setActivePage({ name: 'contact' });
      } else if (hash === 'faq') {
        setActivePage({ name: 'faq' });
      } else if (hash === 'boutiques') {
        setActivePage({ name: 'boutiques' });
      } else if (hash === 'studio') {
        setActivePage({ name: 'studio' });
      } else if (hash === 'animator') {
        setActivePage({ name: 'animator' });
      } else if (hash.startsWith('policy/')) {
        setActivePage({ name: 'policy', slug: hash.replace('policy/', '') as any });
      } else if (hash.startsWith('admin')) {
        const sub = hash.split('/')[1] as any;
        setActivePage({ name: 'admin', subview: sub || 'dashboard' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: ActivePage) => {
    setHistoryStack((prev) => [...prev, activePage]);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((s) => s.slice(0, -1));
      setActivePage(prev);
    } else {
      setActivePage({ name: 'home' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product getters
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductById = (id: number) => products.find((p) => p.id === id);

  // Cart operations
  const addToCart = (product: Product, sizeId?: number | null, quantity = 1) => {
    const size = sizeId ? product.sizes.find((s) => s.id === sizeId) : null;
    const unitPrice = size ? size.price : product.basePrice;
    const salePrice = size ? size.salePrice : product.salePrice;
    const effectivePrice = salePrice && salePrice > 0 && salePrice < unitPrice ? salePrice : unitPrice;
    const sizeLabel = size ? size.label : '50ml Signature';
    const stockAvailable = size ? size.stock : product.stock;

    if (stockAvailable < 1) {
      showToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    const cartId = `${product.id}-${sizeId || 'base'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stockAvailable);
        return prev.map((item) => (item.id === cartId ? { ...item, quantity: newQty } : item));
      }
      const newItem: CartItem = {
        id: cartId,
        productId: product.id,
        sizeId: sizeId || null,
        quantity: Math.min(quantity, stockAvailable),
        name: product.name,
        slug: product.slug,
        image: product.images[0] || '',
        sizeLabel,
        unitPrice,
        salePrice,
        effectivePrice,
        stock: stockAvailable,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name} (${sizeLabel}) to your cart`, 'success');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0);
  const cartShipping =
    cart.length === 0 ? 0 : cartSubtotal >= settings.free_delivery_threshold ? 0 : settings.shipping_flat;
  const cartTotal = cartSubtotal + cartShipping;
  const freeShippingRemaining = Math.max(0, settings.free_delivery_threshold - cartSubtotal);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from wishlist' : 'Saved to your wishlist', 'info');
      return updated;
    });
  };

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  // Quick View
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Place Order
  const placeOrder = (data: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    notes?: string;
  }) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
      today.getDate()
    ).padStart(2, '0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ARS-${dateStr}-${rand}`;

    const orderItems = cart.map((c) => ({
      productId: c.productId,
      nameSnapshot: c.name,
      sizeLabel: c.sizeLabel,
      quantity: c.quantity,
      unitPrice: c.effectivePrice,
      lineTotal: c.effectivePrice * c.quantity,
      image: c.image,
    }));

    const newOrder: Order = {
      id: Date.now(),
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      notes: data.notes,
      subtotal: cartSubtotal,
      shipping: cartShipping,
      discount: 0,
      total: cartTotal,
      paymentMethod: 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const itemsForProd = cart.filter((c) => c.productId === prod.id);
        if (!itemsForProd.length) return prod;

        let newProdStock = prod.stock;
        const newSizes = prod.sizes.map((s) => {
          const match = itemsForProd.find((c) => c.sizeId === s.id);
          if (match) {
            newProdStock = Math.max(0, newProdStock - match.quantity);
            return { ...s, stock: Math.max(0, s.stock - match.quantity) };
          }
          return s;
        });

        // Also if purchased base
        const baseMatch = itemsForProd.find((c) => !c.sizeId);
        if (baseMatch) {
          newProdStock = Math.max(0, newProdStock - baseMatch.quantity);
        }

        return { ...prod, stock: newProdStock, sizes: newSizes };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const findOrder = (orderNumber: string, phone: string) => {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '');
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanNum &&
        (o.phone.replace(/\D/g, '').endsWith(cleanPhone) ||
          cleanPhone.endsWith(o.phone.replace(/\D/g, '')))
    );
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              internalNotes: note ? `${o.internalNotes ? o.internalNotes + '\n' : ''}${note}` : o.internalNotes,
            }
          : o
      )
    );
    showToast(`Order status updated to ${status}`, 'success');
  };

  // Reviews
  const addReview = (data: {
    productId: number;
    name: string;
    email?: string;
    rating: number;
    title?: string;
    body: string;
  }) => {
    const newRev: Review = {
      id: Date.now(),
      productId: data.productId,
      name: data.name,
      email: data.email,
      rating: data.rating,
      title: data.title,
      body: data.body,
      approved: true, // Auto-approve in client demo so user immediately sees their review!
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === data.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id && r.approved), newRev];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Math.round(avg * 10) / 10,
            reviewCount: prodReviews.length,
          };
        }
        return p;
      })
    );

    showToast('Thank you! Your fragrance review has been published.', 'success');
  };

  const toggleReviewApproval = (reviewId: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, approved: !r.approved } : r))
    );
    showToast('Review status updated', 'info');
  };

  const deleteReview = (reviewId: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Review removed', 'info');
  };

  // Inventory & Product Management
  const updateProductStock = (productId: number, sizeId: number | null, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        if (sizeId) {
          return {
            ...p,
            sizes: p.sizes.map((s) => (s.id === sizeId ? { ...s, stock: newStock } : s)),
          };
        }
        return { ...p, stock: newStock };
      })
    );
    showToast('Inventory stock updated', 'success');
  };

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    showToast(`Product "${product.name}" saved`, 'success');
  };

  const deleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed', 'info');
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated', 'success');
  };

  const updateHomepageContent = (newContent: Partial<HomepageContent>) => {
    setHomepageContent((prev) => ({ ...prev, ...newContent }));
    showToast('Homepage presentation updated', 'success');
  };

  // Admin Authentication Functions
  const adminLogin = (username: string, password: string): { ok: boolean; error?: string } => {
    const now = Date.now();
    if (lockoutUntil > now) {
      const waitMin = Math.ceil((lockoutUntil - now) / (60 * 1000));
      return {
        ok: false,
        error: `Too many failed login attempts. Locked out for security. Try again in ${waitMin} minutes.`,
      };
    }

    const cleanUser = username.trim();
    if (cleanUser === adminCreds.username && password === adminCreds.password) {
      setFailedAttempts(0);
      setLockoutUntil(0);
      setIsAdminAuthenticated(true);
      setAdminUser({ username: cleanUser, role: 'owner' });
      showToast('Welcome to the ARSHÉ Admin Console.', 'success');
      return { ok: true };
    }

    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      setLockoutUntil(now + 15 * 60 * 1000);
      return {
        ok: false,
        error: 'Too many incorrect attempts. Account locked for 15 minutes.',
      };
    }

    return {
      ok: false,
      error: `Incorrect credentials. ${5 - nextAttempts} attempts remaining before temporary lockout.`,
    };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    showToast('Admin session ended.', 'info');
  };

  const setCustomAdminCredentials = (username: string, password: string) => {
    const cleanUser = username.trim() || 'owner';
    const cleanPass = password.trim();
    setAdminCreds({ username: cleanUser, password: cleanPass });
    setAdminUser({ username: cleanUser, role: 'owner' });
    setIsAdminAuthenticated(true);
    setFailedAttempts(0);
    setLockoutUntil(0);
    showToast(`Welcome to ARSHÉ Admin Console, ${cleanUser}.`, 'success');
  };

  const changeAdminCredentials = (
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ): { ok: boolean; error?: string } => {
    if (currentPassword !== adminCreds.password) {
      return { ok: false, error: 'Current password is incorrect.' };
    }

    if (newPassword && newPassword.length < 8) {
      return { ok: false, error: 'New password must be at least 8 characters long.' };
    }

    const updatedUser = newUsername ? newUsername.trim() : adminCreds.username;
    const updatedPass = newPassword ? newPassword : adminCreds.password;

    setAdminCreds({ username: updatedUser, password: updatedPass });
    setAdminUser({ username: updatedUser, role: 'owner' });
    showToast('Admin credentials updated successfully.', 'success');
    return { ok: true };
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        navigateTo,
        goBack,
        products,
        categories,
        collections,
        getProductBySlug,
        getProductById,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartShipping,
        cartTotal,
        freeShippingRemaining,
        itemCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        orders,
        placeOrder,
        findOrder,
        updateOrderStatus,
        reviews,
        addReview,
        toggleReviewApproval,
        deleteReview,
        updateProductStock,
        saveProduct,
        deleteProduct,
        settings,
        updateSettings,
        homepageContent,
        updateHomepageContent,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        changeAdminCredentials,
        setCustomAdminCredentials,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
