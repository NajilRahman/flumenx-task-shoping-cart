import { Product, IProduct } from '../models/product.model';

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find();
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};
