import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find().populate('brand category tax unit')
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
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
    const newProduct = new Product({
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
    })
    const savedProduct = await newProduct.save()
    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: (error as Error).message },
      { status: 500 }
    )
  }
}
