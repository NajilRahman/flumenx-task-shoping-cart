import React from 'react';
import type { CartItem } from '../api/api';

interface CartListProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  isUpdatingId: string | null;
  onClose?: () => void;
}

export const CartList: React.FC<CartListProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  isUpdatingId,
  onClose,
}) => {
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center flex flex-col items-center justify-center min-h-[400px] shadow-xs relative h-full">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-500 hover:text-violet-600 lg:hidden cursor-pointer flex items-center gap-1.5 font-bold text-sm p-1"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Shop</span>
          </button>
        )}
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Looks like you haven't added any products to your cart yet. Browse our selection and pick something nice!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col h-full relative">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-violet-600 lg:hidden cursor-pointer flex items-center gap-1.5 font-bold text-sm"
            type="button"
            aria-label="Back to Shop"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Shop</span>
          </button>
        )}
        <div className="flex items-center justify-between flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">Shopping Cart</h2>
            <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px] flex-grow pr-1 my-2">
        {cartItems.map((item) => {
          const product = item.productId;
          if (!product) return null;
          
          const isItemUpdating = isUpdatingId === item._id || isUpdatingId === product._id;
          const itemTotal = product.price * item.quantity;

          return (
            <div key={item._id} className="py-4 flex gap-4 items-start group">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl bg-slate-50 border border-slate-100"
              />

              <div className="flex-grow min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate mb-0.5 group-hover:text-violet-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium mb-2">
                  ${product.price.toFixed(2)} each
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                    <button
                      onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isItemUpdating}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-xs disabled:opacity-20 transition-all font-bold cursor-pointer"
                      type="button"
                    >
                      &minus;
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= product.stock || isItemUpdating}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-xs disabled:opacity-20 transition-all font-bold cursor-pointer"
                      type="button"
                    >
                      &#43;
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item._id)}
                    disabled={isItemUpdating}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors px-1 py-1 rounded cursor-pointer disabled:opacity-40"
                    type="button"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-slate-900 block">
                  ${itemTotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal Quantity</span>
          <span className="font-medium">{totalQuantity} items</span>
        </div>
        <div className="flex items-center justify-between text-slate-900">
          <span className="font-bold">Total Est.</span>
          <span className="text-2xl font-extrabold text-violet-600">${cartTotal.toFixed(2)}</span>
        </div>

        <button
          disabled
          className="w-full bg-slate-100 text-slate-400 font-semibold py-3 px-4 rounded-xl border border-slate-200/50 cursor-not-allowed text-center text-sm"
          type="button"
        >
          Checkout Disabled
        </button>
      </div>
    </div>
  );
};
