import { Product, IProduct } from '../models/product.model';

export interface GetProductsOptions {
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface GetProductsResult {
  products: IProduct[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export const getProducts = async (options: GetProductsOptions = {}): Promise<GetProductsResult> => {
  const {
    search,
    inStock,
    minPrice,
    maxPrice,
    page = 1,
    limit = 6,
  } = options;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (inStock === true) {
    query.stock = { $gt: 0 };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    products,
    total,
    page,
    pages,
    limit,
  };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};
