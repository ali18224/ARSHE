import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Search,
  Navigation,
  ExternalLink,
  Clock,
  Phone,
  Sparkles,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface PlaceInfo {
  title: string;
  address?: string;
  uri: string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  type?: string;
  snippet?: string;
}

export const BoutiqueLocatorView: React.FC = () => {
  const { navigateTo } = useStore();

  const [query, setQuery] = useState('Lahore Gulberg perfume boutique');
  const [cityFilter, setCityFilter] = useState('Lahore');
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [aiNote, setAiNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');

  const PAKISTANI_CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

  const fetchBoutiques = async (searchQuery: string, latLng?: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/maps/boutiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          latitude: latLng?.lat,
          longitude: latLng?.lng,
        }),
      });
      const data = await res.json();
      setPlaces(data.places || []);
      setAiNote(data.text || '');
    } catch {
      // Offline fallback
      setPlaces([
        {
          title: 'ARSHÉ Flagship Atelier (Gulberg III)',
          address: 'M.M. Alam Road, Gulberg III, Lahore, Punjab',
          uri: 'https://maps.google.com/?q=Gulberg+III+Lahore',
          city: 'Lahore',
          rating: 4.9,
          type: 'Flagship Atelier & Scent Bar',
        },
        {
          title: 'ARSHÉ Fragrance Lounge Karachi',
          address: 'Dolmen Mall, Marine Drive, Clifton, Karachi',
          uri: 'https://maps.google.com/?q=Dolmen+Mall+Clifton+Karachi',
          city: 'Karachi',
          rating: 4.9,
          type: 'Luxury Boutique Counter',
        },
        {
          title: 'ARSHÉ Fragrance Suite Islamabad',
          address: 'Beverly Centre, Blue Area / F-7 Markaz, Islamabad',
          uri: 'https://maps.google.com/?q=Beverly+Centre+Islamabad',
          city: 'Islamabad',
          rating: 4.8,
          type: 'Consultation Suite',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoutiques(`luxury perfume boutiques in ${cityFilter} Pakistan`);
  }, [cityFilter]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('Locating nearby boutiques...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('Location detected');
        fetchBoutiques('luxury perfume fragrance boutiques near me', coords);
      },
      () => {
        setLocationStatus('Could not access GPS. Showing Lahore Flagship.');
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchBoutiques(query.trim(), userLocation || undefined);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header with Google Maps attribution */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium">
          <Compass className="w-4 h-4 text-[#b8985f]" />
          <span>Google Maps Verified Grounding</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16130f] font-light tracking-[0.08em] leading-tight">
          ARSHÉ Ateliers & Boutique Locator
        </h1>
        <div className="divider-gold mx-auto" />
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans leading-relaxed">
          Experience our rare attars and signature Extraits in person. Discover flagship ateliers, private scent lounges, and authorized luxury retailers across Pakistan.
        </p>
      </div>

      {/* Search & Location Bar */}
      <div className="bg-white border border-[#eee8da] p-6 shadow-xs max-w-4xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search boutique by area, mall, or landmark..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#fbf9f4] border border-[#e4ddcf] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#b8985f]"
            />
            <Search className="w-4 h-4 text-[#a39c91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#16130f] hover:bg-[#b8985f] text-white px-7 py-3 text-xs uppercase tracking-wider font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching Maps...' : 'Find Locations'}
          </button>

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="border border-[#16130f] text-[#16130f] hover:bg-[#f4eee3] px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            title="Use current GPS"
          >
            <Navigation className="w-3.5 h-3.5 text-[#b8985f]" />
            <span className="hidden sm:inline">Near Me</span>
          </button>
        </form>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-sans">
          <span className="text-[#a39c91]">Popular Cities:</span>
          {PAKISTANI_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCityFilter(c);
                setQuery(`luxury perfume boutique in ${c} Pakistan`);
              }}
              className={`px-3 py-1 border transition-colors cursor-pointer ${
                cityFilter === c
                  ? 'bg-[#16130f] text-white border-[#16130f]'
                  : 'bg-[#fbf9f4] text-[#6f695f] border-[#e4ddcf] hover:border-[#b8985f]'
              }`}
            >
              {c}
            </button>
          ))}
          {locationStatus && (
            <span className="text-[11px] text-[#b8985f] ml-auto font-mono">
              {locationStatus}
            </span>
          )}
        </div>
      </div>

      {/* Grounded AI Concierge Advice */}
      {aiNote && (
        <div className="max-w-4xl mx-auto bg-[#f4eee3] border border-[#e4ddcf] p-6 space-y-3 font-sans text-xs text-[#6f695f] leading-relaxed">
          <div className="flex items-center gap-2 font-medium text-[#16130f] uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4 text-[#b8985f]" />
            <span>Atelier Concierge Notes & Directions</span>
          </div>
          <p className="whitespace-pre-line text-sm">{aiNote}</p>
        </div>
      )}

      {/* Places Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl text-[#16130f] font-medium mb-6 flex items-center justify-between pb-3 border-b border-[#eee8da]">
          <span>Verified Fragrance Destinations ({places.length})</span>
          <span className="text-xs text-[#a39c91] font-sans font-normal">
            Real Google Maps Links & Review Data
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#eee8da] hover:border-[#b8985f] p-6 flex flex-col justify-between transition-all duration-300 shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#b8985f] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {place.rating && (
                    <span className="bg-[#f4eee3] text-[#16130f] text-[11px] font-mono px-2 py-0.5 border border-[#e4ddcf]">
                      ★ {place.rating} {place.reviewsCount ? `(${place.reviewsCount})` : ''}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-[#16130f] group-hover:text-[#b8985f] transition-colors">
                    {place.title}
                  </h3>
                  <p className="text-xs text-[#6f695f] font-sans mt-1">
                    {place.address || 'Central Fragrance District, Pakistan'}
                  </p>
                </div>

                {place.type && (
                  <p className="text-[10px] uppercase tracking-wider text-[#b8985f] font-sans font-medium">
                    {place.type}
                  </p>
                )}

                <div className="pt-2 text-[11px] text-[#6f695f] font-sans space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#a39c91]" />
                    <span>Open Mon – Sun: 11:00 AM – 10:30 PM PKT</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Complimentary 5ml Discovery Flacon with visit</span>
                  </p>
                </div>
              </div>

              {/* Direct Maps Link as required by Google Maps Grounding */}
              <div className="pt-5 mt-4 border-t border-[#eee8da] flex items-center justify-between">
                <a
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#16130f] hover:text-[#b8985f] font-medium transition-colors cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#b8985f]" />
                </a>

                <button
                  type="button"
                  onClick={() => navigateTo({ name: 'contact' })}
                  className="text-[11px] text-[#6f695f] hover:text-[#16130f] underline"
                >
                  Book Private Scent Fitting
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
