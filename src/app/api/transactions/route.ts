import { NextResponse } from 'next/server'
import Transaction from '@/models/Transaction'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    const body = await req.json()
    const transaction = new Transaction(body)
    await transaction.save()
    return NextResponse.json(
      { message: 'Transaction saved successfully', transaction },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving transaction:', error)
    return NextResponse.json(
      { message: 'Error saving transaction', error },
      { status: 500 }
    )
  }
}
