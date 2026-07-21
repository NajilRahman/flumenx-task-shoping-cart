import { useEffect, useState } from 'react';
import {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  type Product,
  type CartItem,
} from './api/api';
import { ProductCard } from './components/ProductCard';
import { CartList } from './components/CartList';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingId, setIsAddingId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(6);

  const [view, setView] = useState<'shop' | 'cart'>('shop');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const loadData = async (
    currentPage = page,
    currentSearch = search,
    currentInStock = inStock,
    currentMin = minPrice,
    currentMax = maxPrice
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page: currentPage,
        limit,
      };
      if (currentSearch.trim() !== '') params.search = currentSearch.trim();
      if (currentInStock) params.inStock = true;
      if (currentMin !== '' && !isNaN(parseFloat(currentMin))) params.minPrice = parseFloat(currentMin);
      if (currentMax !== '' && !isNaN(parseFloat(currentMax))) params.maxPrice = parseFloat(currentMax);

      const [paginatedResult, fetchedCart] = await Promise.all([
        fetchProducts(params),
        fetchCart(),
      ]);

      setProducts(paginatedResult.products);
      setTotalPages(paginatedResult.pages);
      setPage(paginatedResult.page);
      setCartItems(fetchedCart);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page, search, inStock, minPrice, maxPrice);
  }, [page, inStock]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      loadData(1, search, inStock, minPrice, maxPrice);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, minPrice, maxPrice]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    setIsAddingId(productId);
    setError(null);
    try {
      await addToCart(productId, quantity);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error adding product to cart');
    } finally {
      setIsAddingId(null);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    setIsUpdatingId(cartItemId);
    setError(null);
    try {
      await updateCartQuantity(cartItemId, newQuantity);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error updating item quantity');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setIsUpdatingId(cartItemId);
    setError(null);
    try {
      await removeFromCart(cartItemId);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error removing item from cart');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => setView('shop')}
            className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0 leading-none">
              FlumenX Shop
            </h1>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView((v) => (v === 'cart' ? 'shop' : 'cart'))}
              type="button"
              className="relative p-2 text-slate-600 hover:text-violet-600 transition-colors cursor-pointer focus:outline-none"
              aria-label="View shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalCartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-violet-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalCartQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 shadow-xs">
            <div className="text-rose-500 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-rose-800 text-sm">Error Occurred</h3>
              <p className="text-rose-700 text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              type="button"
              className="text-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className={`lg:col-span-2 space-y-6 ${view === 'shop' ? 'block' : 'hidden lg:block'}`}>
            <div className="sm:hidden mb-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 mb-8 shadow-xs space-y-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filters & Search</h3>
                <button
                  onClick={() => {
                    setSearch('');
                    setInStock(false);
                    setMinPrice('');
                    setMaxPrice('');
                    setPage(1);
                  }}
                  type="button"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 underline cursor-pointer self-start"
                >
                  Clear All Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name, description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-slate-800"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Min Price ($)</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-slate-800"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Price ($)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-slate-800"
                    min="0"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-5 h-5 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Our Products</h2>
              <button
                onClick={() => loadData(page, search, inStock, minPrice, maxPrice)}
                type="button"
                className="text-slate-500 hover:text-violet-600 text-sm font-semibold flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.283 8H18" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl">
                <svg className="animate-spin h-10 w-10 text-violet-600 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-slate-500 font-medium">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
                <p className="text-slate-500">No products match your search or filter criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isAdding={isAddingId === product._id}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      type="button"
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Previous
                    </button>
                    <div className="hidden sm:flex gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          type="button"
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                            p === page
                              ? 'bg-violet-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <span className="sm:hidden text-xs font-semibold text-slate-500">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      type="button"
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`lg:col-span-1 ${view === 'cart' ? 'block' : 'hidden lg:block'}`}>
            <CartList
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              isUpdatingId={isUpdatingId}
              onClose={() => setView('shop')}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
