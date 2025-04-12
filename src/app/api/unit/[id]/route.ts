import dbConnect from '@/lib/db'

import Unit from '@/models/Unit'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const deleteUnit = await Unit.findByIdAndDelete(id)
    if (!deleteUnit) {
      return NextResponse.json({ message: 'Unit not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Unit deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting taxunit', error: (error as Error).message },
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
    const { name } = await req.json()
    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    )

    if (!updatedUnit) {
      return NextResponse.json({ message: 'Unit not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Unit updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating unit', error: (error as Error).message },
      { status: 500 }
    )
  }
}
