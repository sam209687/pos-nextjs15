import dbConnect from '@/lib/db'

import Tax from '@/models/Tax'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const deleteTax = await Tax.findByIdAndDelete(id)
    if (!deleteTax) {
      return NextResponse.json({ message: 'Tax not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Tax deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting tax', error: (error as Error).message },
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
    const { id } = params
    const { name, gst } = await req.json()
    const updatedTax = await Tax.findByIdAndUpdate(
      id,
      { name, gst },
      { new: true, runValidators: true }
    )

    if (!updatedTax) {
      return NextResponse.json({ message: 'Tax not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Tax updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating tax', error: (error as Error).message },
      { status: 500 }
    )
  }
}
