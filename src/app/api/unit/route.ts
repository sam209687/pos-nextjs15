import dbConnect from '@/lib/db'

import Unit from '@/models/Unit'

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()
    const unit = await Unit.find()
    return NextResponse.json(unit)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching unit', error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { name } = await req.json()
    const newUnit = new Unit({ name })
    const savedUnit = await newUnit.save()
    return NextResponse.json(savedUnit, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error saving unit', error: (error as Error).message },
      { status: 500 }
    )
  }
}
