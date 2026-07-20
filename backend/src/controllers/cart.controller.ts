import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await cartService.getCartItems();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    if (quantity === undefined || quantity === null) {
      res.status(400).json({ message: 'Quantity is required' });
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      res.status(400).json({ message: 'Quantity must be a positive integer greater than or equal to 1' });
      return;
    }

    const cartItem = await cartService.addProductToCart(productId, parsedQuantity);
    res.status(201).json(cartItem);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error adding product to cart';
    res.status(400).json({ message });
  }
};

export const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      res.status(400).json({ message: 'Quantity is required' });
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      res.status(400).json({ message: 'Quantity must be a positive integer greater than or equal to 1' });
      return;
    }

    const cartItem = await cartService.updateCartItemQuantity(id, parsedQuantity);
    res.status(200).json(cartItem);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating cart item quantity';
    res.status(400).json({ message });
  }
};

export const deleteCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await cartService.removeCartItem(id);
    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error removing item from cart';
    res.status(400).json({ message });
  }
};
