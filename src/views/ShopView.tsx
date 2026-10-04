import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, X, Search, RotateCcw, Check } from 'lucide-react';
import type { FragranceFamily, Gender } from '../types';

interface ShopViewProps {
  initialParams?: {
    category?: string;
    family?: string;
    gender?: string;
    q?: string;
  };
}

export const ShopView: React.FC<ShopViewProps> = ({ initialParams }) => {
  const { products, categories } = useStore();

  // Local filter states
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>(
    (initialParams?.gender as Gender) || 'all'
  );
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily | 'all'>(
    (initialParams?.family as FragranceFamily) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialParams?.category || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>(initialParams?.q || '');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [onlyBestSeller, setOnlyBestSeller] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 20000,
  });

  const [sortOption, setSortOption] = useState<'newest' | 'best' | 'price_asc' | 'price_desc' | 'name'>('best');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const FAMILIES: { key: FragranceFamily; label: string }[] = [
    { key: 'oud', label: 'Oud' },
    { key: 'woody', label: 'Woody' },
    { key: 'floral', label: 'Floral' },
    { key: 'citrus', label: 'Citrus' },
    { key: 'oriental', label: 'Oriental' },
    { key: 'fresh', label: 'Fresh' },
    { key: 'amber', label: 'Amber' },
    { key: 'gourmand', label: 'Gourmand' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;

      // Gender
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

      // Family
      if (selectedFamily !== 'all' && p.fragranceFamily !== selectedFamily) return false;

      // Category
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }

      // Stock
      if (onlyInStock && p.stock <= 0) return false;

      // Sale
      if (onlySale && (!p.salePrice || p.salePrice >= p.basePrice)) return false;

      // Best Seller
      if (onlyBestSeller && !p.isBestSeller) return false;

      // Price
      const effective = p.salePrice && p.salePrice < p.basePrice ? p.salePrice : p.basePrice;
      if (effective < priceRange.min || effective > priceRange.max) return false;

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFamily = p.fragranceFamily.toLowerCase().includes(q);
        const matchNotes =
          p.topNotes.toLowerCase().includes(q) ||
          p.heartNotes.toLowerCase().includes(q) ||
          p.baseNotes.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchName && !matchFamily && !matchNotes && !matchDesc) return false;
      }

      return true;
    });
  }, [
    products,
    categories,
    selectedGender,
    selectedFamily,
    selectedCategory,
    onlyInStock,
    onlySale,
    onlyBestSeller,
    priceRange,
    searchTerm,
  ]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.salePrice && a.salePrice < a.basePrice ? a.salePrice : a.basePrice;
      const priceB = b.salePrice && b.salePrice < b.basePrice ? b.salePrice : b.basePrice;

      if (sortOption === 'price_asc') return priceA - priceB;
      if (sortOption === 'price_desc') return priceB - priceA;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'newest') return Number(b.isNewArrival) - Number(a.isNewArrival);
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [filteredProducts, sortOption]);

  const resetAllFilters = () => {
    setSelectedGender('all');
    setSelectedFamily('all');
    setSelectedCategory('all');
    setSearchTerm('');
    setOnlyInStock(false);
    setOnlySale(false);
    setOnlyBestSeller(false);
    setPriceRange({ min: 0, max: 20000 });
  };

  const hasActiveFilters =
    selectedGender !== 'all' ||
    selectedFamily !== 'all' ||
    selectedCategory !== 'all' ||
    searchTerm.trim() !== '' ||
    onlyInStock ||
    onlySale ||
    onlyBestSeller ||
    priceRange.min > 0 ||
    priceRange.max < 20000;

  // Filter Sidebar Element
  const FilterContent = (
    <div className="space-y-6 text-xs font-sans">
      {/* Gender */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#16130f] font-medium mb-3">
          Gender
        </h4>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Fragrances' },
            { id: 'men', label: 'For Him' },
            { id: 'women', label: 'For Her' },
            { id: 'unisex', label: 'Unisex' },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 text-[#6f695f] hover:text-[#16130f] cursor-pointer py-1"
            >
              <input
                type="radio"
                name="genderFilter"
                checked={selectedGender === item.id}
                onChange={() => setSelectedGender(item.id as any)}
                className="accent-[#b8985f]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fragrance Families */}
      <div className="pt-4 border-t border-[#eee8da]">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#16130f] font-medium mb-3">
          Fragrance Family
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-[#6f695f] hover:text-[#16130f] cursor-pointer py-1">
            <input
              type="radio"
              name="familyFilter"
              checked={selectedFamily === 'all'}
              onChange={() => setSelectedFamily('all')}
              className="accent-[#b8985f]"
            />
            <span>All Families</span>
          </label>
          {FAMILIES.map((fam) => (
            <label
              key={fam.key}
              className="flex items-center gap-2 text-[#6f695f] hover:text-[#16130f] cursor-pointer py-1"
            >
              <input
                type="radio"
                name="familyFilter"
                checked={selectedFamily === fam.key}
                onChange={() => setSelectedFamily(fam.key)}
                className="accent-[#b8985f]"
              />
              <span>{fam.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="pt-4 border-t border-[#eee8da]">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#16130f] font-medium mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[#6f695f] hover:text-[#16130f] cursor-pointer py-1">
            <input
              type="radio"
              name="catFilter"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="accent-[#b8985f]"
            />
            <span>All Categories</span>
          </label>
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-[#6f695f] hover:text-[#16130f] cursor-pointer py-1"
            >
              <input
                type="radio"
                name="catFilter"
                checked={selectedCategory === c.slug}
                onChange={() => setSelectedCategory(c.slug)}
                className="accent-[#b8985f]"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-[#eee8da]">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#16130f] font-medium mb-3">
          Price Range (PKR)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[#a39c91] block mb-1">Min</label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min || ''}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) || 0 }))
              }
              className="w-full p-2 bg-white border border-[#e4ddcf] text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#a39c91] block mb-1">Max</label>
            <input
              type="number"
              placeholder="20,000"
              value={priceRange.max === 20000 ? '' : priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) || 20000 }))
              }
              className="w-full p-2 bg-white border border-[#e4ddcf] text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-4 border-t border-[#eee8da] space-y-2">
        <label className="flex items-center gap-2 text-[#16130f] cursor-pointer py-1">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="accent-[#b8985f]"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 text-[#16130f] cursor-pointer py-1">
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => setOnlySale(e.target.checked)}
            className="accent-[#b8985f]"
          />
          <span>Special Offers / On Sale</span>
        </label>
        <label className="flex items-center gap-2 text-[#16130f] cursor-pointer py-1">
          <input
            type="checkbox"
            checked={onlyBestSeller}
            onChange={(e) => setOnlyBestSeller(e.target.checked)}
            className="accent-[#b8985f]"
          />
          <span>Best Sellers</span>
        </label>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetAllFilters}
          className="w-full mt-4 border border-[#16130f] py-2 text-xs uppercase tracking-wider text-[#16130f] hover:bg-[#16130f] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8985f] font-sans font-medium mb-1">
          Artisanal Catalog
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#16130f] font-light tracking-[0.06em]">
          Fragrances of ARSHÉ
        </h1>
        <p className="text-xs sm:text-sm text-[#6f695f] font-sans mt-2 max-w-xl">
          Concentrated Eau de Parfum compositions crafted with Taif rose, Cambodian agarwood, and Mysore sandalwood.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#eee8da]">
        {/* Mobile filter button & result count */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 border border-[#16130f] bg-white px-4 py-2.5 text-xs uppercase tracking-wider text-[#16130f] active:bg-[#f4eee3]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#b8985f]" />
            )}
          </button>

          <span className="text-xs text-[#6f695f] font-sans">
            Showing <strong className="text-[#16130f]">{sortedProducts.length}</strong> fragrances
          </span>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
          {/* Quick search input */}
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Search scents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#e4ddcf] text-xs text-[#16130f] placeholder:text-[#a39c91] focus:outline-none focus:border-[#b8985f]"
            />
            <Search className="w-3.5 h-3.5 text-[#a39c91] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a39c91] hover:text-[#16130f]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="border border-[#e4ddcf] bg-white px-3 py-2 text-xs text-[#16130f] font-sans cursor-pointer focus:outline-none focus:border-[#b8985f]"
          >
            <option value="best">Most Loved (Best Sellers)</option>
            <option value="newest">Newest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-sans">
          <span className="text-[#a39c91]">Active filters:</span>
          {selectedGender !== 'all' && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              Gender: {selectedGender}
              <button onClick={() => setSelectedGender('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedFamily !== 'all' && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              Family: {selectedFamily}
              <button onClick={() => setSelectedFamily('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlyInStock && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              In Stock
              <button onClick={() => setOnlyInStock(false)} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlySale && (
            <span className="bg-white border border-[#e4ddcf] px-2.5 py-1 flex items-center gap-1.5 text-[#16130f]">
              Special Offers
              <button onClick={() => setOnlySale(false)} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-[#b8985f] hover:underline underline-offset-2 ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Desktop sidebar + products grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden md:block col-span-1 bg-white border border-[#eee8da] p-5 h-fit sticky top-28">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#eee8da]">
            <h3 className="font-serif text-lg text-[#16130f] font-medium">Refine Fragrances</h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-[#b8985f] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          {FilterContent}
        </aside>

        {/* Product Cards Grid (Right) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          {sortedProducts.length === 0 ? (
            <div className="bg-white border border-[#eee8da] p-12 text-center my-6">
              <h3 className="font-serif text-2xl text-[#16130f] mb-2">No Fragrances Found</h3>
              <p className="text-xs text-[#6f695f] font-sans max-w-sm mx-auto mb-6">
                No perfumes match your selected criteria. Try adjusting or clearing your filters to see more creations.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#16130f] text-white px-6 py-3 text-xs uppercase tracking-wider hover:bg-[#b8985f] transition-colors"
              >
                Show All Fragrances
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-[85%] max-w-sm bg-[#fbf9f4] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-[#eee8da] flex items-center justify-between">
              <h3 className="font-serif text-2xl text-[#16130f]">Filter Fragrances</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-[#16130f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{FilterContent}</div>
            <div className="p-4 bg-white border-t border-[#eee8da]">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#16130f] text-white py-3 text-xs uppercase tracking-wider"
              >
                View {sortedProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
