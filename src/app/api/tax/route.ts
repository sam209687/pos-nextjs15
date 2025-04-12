import dbConnect from '@/lib/db'
import Tax from '@/models/Tax'

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()
    const tax = await Tax.find()
    return NextResponse.json(tax)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching tax', error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { name, gst } = await req.json()
    const newtax = new Tax({ name, gst })
    const savedtax = await newtax.save()
    return NextResponse.json(savedtax, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error saving tax', error: (error as Error).message },
      { status: 500 }
    )
  }
}
