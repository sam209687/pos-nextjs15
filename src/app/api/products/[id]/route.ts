import { NextRequest, NextResponse } from 'next/server'

import Product from '@/models/Product'
import dbConnect from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = await params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting products', error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = await params
    const {
      productName,
      productCode,
      productDescription,
      brand,
      category,
      tax,
      sellingPrice,
      productionPrice,
      unit,
      totalQty,
      alertQty,
      qrCode,
    } = await req.json()
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productCode,
        productDescription,
        brand,
        category,
        tax,
        sellingPrice,
        productionPrice,
        unit,
        totalQty,
        alertQty,
        qrCode,
      },
      { new: true, runValidators: true }
    )
    if (!updatedProduct)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating products', error: (error as Error).message },
      { status: 500 }
    )
  }
}
