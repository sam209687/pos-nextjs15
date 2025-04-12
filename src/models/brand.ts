import mongoose, { Schema, Document } from 'mongoose'

interface IBrand extends Document {
  name: string
  description: string
  image: string
}

const BrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Brand ||
  mongoose.model<IBrand>('Brand', BrandSchema)
