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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedCart] = await Promise.all([
        fetchProducts({}),
        fetchCart(),
      ]);
      setProducts(fetchedProducts.products || fetchedProducts);
      setCartItems(fetchedCart);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">FlumenX Shop</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {loading ? (
            <p>Loading products...</p>
          ) : (
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
          )}
        </div>
        <div className="col-span-1">
          <CartList
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            isUpdatingId={isUpdatingId}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
