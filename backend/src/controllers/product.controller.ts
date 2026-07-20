import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, inStock, minPrice, maxPrice, page, limit } = req.query;

    const options: productService.GetProductsOptions = {};

    if (typeof search === 'string' && search.trim() !== '') {
      options.search = search.trim();
    }

    if (inStock === 'true') {
      options.inStock = true;
    }

    if (typeof minPrice === 'string' && !isNaN(parseFloat(minPrice))) {
      options.minPrice = parseFloat(minPrice);
    }

    if (typeof maxPrice === 'string' && !isNaN(parseFloat(maxPrice))) {
      options.maxPrice = parseFloat(maxPrice);
    }

    if (typeof page === 'string' && !isNaN(parseInt(page, 10))) {
      options.page = Math.max(1, parseInt(page, 10));
    }

    if (typeof limit === 'string' && !isNaN(parseInt(limit, 10))) {
      options.limit = Math.max(1, parseInt(limit, 10));
    }

    const result = await productService.getProducts(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
