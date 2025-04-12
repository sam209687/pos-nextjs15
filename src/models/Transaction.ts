import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  customerName: string
  customerPhone: string
  paymentMode: string
  totalAmount: number
  paidAmount: number
  balance: number
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    taxRate: number
    total: number
  }>
  createdAt: Date
}

const TransactionSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  paymentMode: { type: String, required: true, enum: ['UPI', 'CASH', 'CARD'] },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  items: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      taxRate: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)
