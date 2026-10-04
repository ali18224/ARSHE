import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CollectionsView } from './views/CollectionsView';
import { CollectionDetailView } from './views/CollectionDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { TrackOrderView } from './views/TrackOrderView';
import { WishlistView } from './views/WishlistView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FaqView } from './views/FaqView';
import { PoliciesView } from './views/PoliciesView';
import { AdminView } from './views/AdminView';
import { BoutiqueLocatorView } from './views/BoutiqueLocatorView';
import { BottleStudioView } from './views/BottleStudioView';
import { FlaconAnimatorView } from './views/FlaconAnimatorView';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  const renderCurrentView = () => {
    switch (activePage.name) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView initialParams={activePage.params} />;
      case 'product':
        return <ProductDetailView slug={activePage.slug} />;
      case 'collections':
        return <CollectionsView />;
      case 'collection':
        return <CollectionDetailView slug={activePage.slug} />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView orderNumber={activePage.orderNumber} />;
      case 'track-order':
        return <TrackOrderView />;
      case 'wishlist':
        return <WishlistView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FaqView />;
      case 'boutiques':
        return <BoutiqueLocatorView />;
      case 'studio':
        return <BottleStudioView />;
      case 'animator':
        return <FlaconAnimatorView />;
      case 'policy':
        return <PoliciesView slug={activePage.slug} />;
      case 'admin':
        return <AdminView subview={activePage.subview} />;
      default:
        return <HomeView />;
    }
  };

  const isAdmin = activePage.name === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#16130f]">
      {/* Top Banner & Header (hidden on admin view for distraction-free console) */}
      {!isAdmin && (
        <>
          <AnnouncementBar />
          <Header />
        </>
      )}

      {/* Main Viewport */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      {!isAdmin && <Footer />}

      {/* Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
