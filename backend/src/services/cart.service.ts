import { Cart, ICart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Types } from 'mongoose';

export const getCartItems = async (): Promise<any[]> => {
  return await Cart.find().populate('productId');
};

export const addProductToCart = async (productId: string, quantity: number): Promise<ICart> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  if (quantity > product.stock) {
    throw new Error(`Insufficient stock. Only ${product.stock} items available`);
  }

  // Check if product is already in the cart
  let cartItem = await Cart.findOne({ productId });

  if (cartItem) {
    const newQuantity = cartItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error(`Cannot add more items. Total quantity (${newQuantity}) exceeds available stock (${product.stock})`);
    }
    cartItem.quantity = newQuantity;
  } else {
    cartItem = new Cart({
      productId,
      quantity,
    });
  }

  return await cartItem.save();
};

export const updateCartItemQuantity = async (id: string, quantity: number): Promise<ICart> => {
  if (quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  // Search by either cart item ID or product ID
  let cartItem = await Cart.findById(id);
  if (!cartItem) {
    if (Types.ObjectId.isValid(id)) {
      cartItem = await Cart.findOne({ productId: id });
    }
  }

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const product = await Product.findById(cartItem.productId);
  if (!product) {
    throw new Error('Product associated with this cart item was not found');
  }

  if (quantity > product.stock) {
    throw new Error(`Insufficient stock. Only ${product.stock} items available`);
  }

  cartItem.quantity = quantity;
  return await cartItem.save();
};

export const removeCartItem = async (id: string): Promise<ICart | null> => {
  // Search and delete by either cart item ID or product ID
  let cartItem = await Cart.findById(id);
  if (!cartItem) {
    if (Types.ObjectId.isValid(id)) {
      cartItem = await Cart.findOne({ productId: id });
    }
  }

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  await Cart.deleteOne({ _id: cartItem._id });
  return cartItem;
};
