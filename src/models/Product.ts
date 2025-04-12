import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  productName: string
  productCode: number
  productDescription: string
  brand: string // Reference to Brand _id
  category: string // Reference to Category _id
  tax: string // Reference to GST/HSN _id
  sellingPrice: number
  productionPrice: number
  unit: string // Reference to Unit _id
  totalQty: number
  alertQty: number
  qrCode: string // URL or base64 of QR code
}

const ProductSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productCode: { type: Number, required: true, min: 1, max: 999 },
    productDescription: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tax: { type: Schema.Types.ObjectId, ref: 'Tax', required: true },
    sellingPrice: { type: Number, required: true },
    productionPrice: { type: Number, required: true },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    totalQty: { type: Number, required: true, default: 0 },
    alertQty: { type: Number, required: true, default: 0 },
    qrCode: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)
