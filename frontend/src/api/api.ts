import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export const fetchProducts = async (params: Record<string, string | number | boolean> = {}): Promise<PaginatedProducts> => {
  const response = await client.get<PaginatedProducts>('/products', { params });
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await client.get<Product>(`/products/${id}`);
  return response.data;
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const response = await client.get<CartItem[]>('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem> => {
  const response = await client.post<CartItem>('/cart', { productId, quantity });
  return response.data;
};

export const updateCartQuantity = async (id: string, quantity: number): Promise<CartItem> => {
  const response = await client.put<CartItem>(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeFromCart = async (id: string): Promise<{ message: string }> => {
  const response = await client.delete<{ message: string }>(`/cart/${id}`);
  return response.data;
};
