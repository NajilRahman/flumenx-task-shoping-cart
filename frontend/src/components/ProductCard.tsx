import React, { useState } from 'react';
import type { Product } from '../api/api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
  isAdding: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdding }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = async () => {
    if (product.stock === 0) return;
    await onAddToCart(product._id, quantity);
    // Reset quantity back to 1 after successful addition
    setQuantity(1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Product Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-500 text-white font-semibold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              Only {product.stock} left
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-violet-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Stock info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</p>
            <p className="text-xl font-extrabold text-slate-900">${product.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Stock Available</p>
            <p className="text-sm font-semibold text-slate-700">{product.stock}</p>
          </div>
        </div>

        {/* Quantity Selector & Add Button */}
        {!isOutOfStock ? (
          <div className="space-y-3 mt-auto">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-1">
              <span className="text-xs font-semibold text-slate-500 pl-3">Quantity</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={decrement}
                  disabled={quantity <= 1 || isAdding}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold"
                  type="button"
                >
                  &minus;
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  disabled={quantity >= product.stock || isAdding}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold"
                  type="button"
                >
                  &#43;
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        ) : (
          <div className="mt-auto">
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-semibold py-2.5 px-4 rounded-xl cursor-not-allowed border border-slate-200/50"
            >
              Unavailable
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
