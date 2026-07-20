import { Schema, model, Document, Types } from 'mongoose';

export interface ICart extends Document {
  productId: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>('Cart', CartSchema);
