import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(errorHandler);

export default app;
