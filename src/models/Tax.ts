import mongoose, { Schema, Document } from 'mongoose'

export interface ITax extends Document {
  name: string
  gst: number
}

const TaxSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    gst: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export default mongoose.models.Tax || mongoose.model<ITax>('Tax', TaxSchema)
