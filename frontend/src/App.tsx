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

  // Search & Filter State
  const [search, setSearch] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(6); // Show 6 products per page

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
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when page or stock checkbox changes
  useEffect(() => {
    loadData(page, search, inStock, minPrice, maxPrice);
  }, [page, inStock]);

  // Handle typing inputs with 400ms debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      loadData(1, search, inStock, minPrice, maxPrice);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, minPrice, maxPrice]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    setIsAddingId(productId);
    try {
      await addToCart(productId, quantity);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError('Error adding product to cart');
    } finally {
      setIsAddingId(null);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    setIsUpdatingId(cartItemId);
    try {
      await updateCartQuantity(cartItemId, newQuantity);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError('Error updating item quantity');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setIsUpdatingId(cartItemId);
    try {
      await removeFromCart(cartItemId);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
    } catch (err: any) {
      setError('Error removing item from cart');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900">FlumenX Shop</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Search & Filters Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 mb-8 shadow-xs space-y-4">
          <input
            type="text"
            placeholder="Search name, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-none text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdding={isAddingId === product._id}
                />
              ))}
            </div>

            {/* Pagination Controls with Refresh Bug! */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                        p === page ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CartList
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              isUpdatingId={isUpdatingId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
