'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Product {
  _id: string
  productName: string
  productCode: number
  sellingPrice: number
  taxRate: number
}

interface CartItem extends Product {
  quantity: number
}

const fetchProducts = async (setProducts: (products: Product[]) => void) => {
  try {
    const res = await fetch('/api/products')
    const data = await res.json()
    const products = Array.isArray(data) ? data : data.data || []
    const validProducts = products.map((p: any) => ({
      ...p,
      sellingPrice: Number(p.sellingPrice) || 0,
      taxRate: Number(p.taxRate) || 0,
    }))
    setProducts(validProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    setProducts([])
  }
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMode, setPaymentMode] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paidAmount, setPaidAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState<number | ''>('')

  useEffect(() => {
    setIsLoading(true)
    fetchProducts(setProducts).then(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent<Document>) => {
      console.log('Key pressed:', event.key, 'Shift:', event.shiftKey)
      if (event.shiftKey && event.key.toLowerCase() === 't') {
        event.preventDefault()
        setIsSearchVisible((prev) => {
          const newState = !prev
          if (newState) setSearchQuery('')
          return newState
        })
      }
    }
    document.addEventListener(
      'keydown',
      handleKeyDown as unknown as EventListener
    )
    return () =>
      document.removeEventListener(
        'keydown',
        handleKeyDown as unknown as EventListener
      )
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productCode.toString().includes(searchQuery)
  )

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id)
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = (Number(item.sellingPrice) || 0) * item.quantity
      const taxAmount = itemTotal * ((Number(item.taxRate) || 0) / 100)
      return total + itemTotal + taxAmount
    }, 0)
  }

  useEffect(() => {
    if (
      paymentMode === 'CASH' &&
      paidAmount !== '' &&
      !isNaN(Number(paidAmount))
    ) {
      const total = calculateTotal()
      const balanceAmount = Number(paidAmount) - total
      setBalance(balanceAmount >= 0 ? balanceAmount : 0)
    } else {
      setBalance('')
    }
  }, [paidAmount, paymentMode, cart])

  const handleCheckout = async () => {
    if (
      !customerName ||
      !customerPhone ||
      !paymentMode ||
      (paymentMode === 'CASH' &&
        (paidAmount === '' || isNaN(Number(paidAmount))))
    ) {
      alert(
        'Please fill all required fields, including customer details and paid amount for CASH.'
      )
      return
    }

    const total = calculateTotal()
    const transactionData = {
      customerName,
      customerPhone,
      paymentMode,
      totalAmount: total,
      paidAmount: paymentMode === 'CASH' ? Number(paidAmount) : total,
      balance: paymentMode === 'CASH' ? Number(balance) : 0,
      items: cart.map((item) => ({
        productId: item._id,
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.sellingPrice) || 0,
        taxRate: Number(item.taxRate) || 0,
        total:
          (Number(item.sellingPrice) || 0) * item.quantity +
          ((Number(item.sellingPrice) || 0) *
            item.quantity *
            (Number(item.taxRate) || 0)) /
            100,
      })),
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Transaction saved successfully!')
        setCart([])
        setPaymentMode('')
        setCustomerName('')
        setCustomerPhone('')
        setPaidAmount('')
        setBalance('')
      } else {
        alert('Failed to save transaction: ' + data.message)
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('An error occurred during checkout.')
    }
  }

  const generateInvoice = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Invoice', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Customer Name: ${customerName}`, 20, 40)
    doc.text(`Phone Number: ${customerPhone}`, 20, 50)
    doc.text(`Payment Mode: ${paymentMode}`, 20, 60)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70)

    autoTable(doc, {
      startY: 80,
      head: [['Product', 'Qty', 'Price (₹)', 'Total (₹)']],
      body: cart.map((item) => [
        item.productName,
        item.quantity,
        `₹${(Number(item.sellingPrice) || 0).toFixed(2)}`,
        `₹${(
          (Number(item.sellingPrice) || 0) * item.quantity +
          ((Number(item.sellingPrice) || 0) *
            item.quantity *
            (Number(item.taxRate) || 0)) /
            100
        ).toFixed(2)}`,
      ]),
      theme: 'grid',
      styles: { cellPadding: 2, fontSize: 10 },
    })

    const finalY = (doc as any).lastAutoTable.finalY || 80
    doc.text(`Total Amount: ₹${calculateTotal().toFixed(2)}`, 20, finalY + 10)
    if (paymentMode === 'CASH') {
      doc.text(
        `Paid Amount: ₹${Number(paidAmount).toFixed(2)}`,
        20,
        finalY + 20
      )
      doc.text(
        `Balance Returned: ₹${Number(balance).toFixed(2)}`,
        20,
        finalY + 30
      )
    }

    // Open print dialog
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Invoice</title></head>
          <body style="margin: 0; padding: 20px;">
            ${doc.output('datauristring').split(',')[1]}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }

    // Save as PDF
    doc.save(`invoice_${new Date().toISOString()}.pdf`)
  }

  if (isLoading) {
    return (
      <div className='p-6 text-center text-gray-600 dark:text-gray-400'>
        Loading...
      </div>
    )
  }

  return (
    <div className='p-6 dark:bg-gray-900 bg-gray-100 min-h-screen'>
      <div className='pt-20'></div>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Point of Sale
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Sell products quickly and efficiently.
        </p>
      </div>

      <Card className='w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <CardContent className='p-6'>
          <div className='grid grid-cols-2 gap-6'>
            {/* Search Activity Column */}
            <div>
              <Card>
                <CardHeader className='p-4 border-b border-gray-200 dark:border-gray-700'>
                  {isSearchVisible && (
                    <div className='mb-2'>
                      <Input
                        type='text'
                        placeholder='Search by name or product code (Shift + T to toggle)'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                        autoFocus
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className='p-4'>
                  <ScrollArea className='h-[500px] w-full'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-gray-100 dark:bg-gray-700'>
                          <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                            Product Name
                          </TableHead>
                          <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                            Code
                          </TableHead>
                          <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                            Price (₹)
                          </TableHead>
                          <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                            Tax (%)
                          </TableHead>
                          <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow
                            key={product._id}
                            className='hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                          >
                            <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                              {product.productName}
                            </TableCell>
                            <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                              {product.productCode}
                            </TableCell>
                            <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                              ₹{product.sellingPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                              {product.taxRate}%
                            </TableCell>
                            <TableCell className='py-2'>
                              <Button
                                onClick={() => addToCart(product)}
                                className='bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md'
                              >
                                Add to Cart
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Cart and Checkout Column */}
            <div>
              <Card>
                <CardContent className='p-4'>
                  {cart.length > 0 && (
                    <>
                      <ScrollArea className='h-[400px] w-full mb-4'>
                        <Table>
                          <TableHeader>
                            <TableRow className='bg-gray-100 dark:bg-gray-700'>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Product
                              </TableHead>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Qty
                              </TableHead>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Price (₹)
                              </TableHead>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Tax (₹)
                              </TableHead>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Total (₹)
                              </TableHead>
                              <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cart.map((item) => {
                              const itemTotal =
                                (Number(item.sellingPrice) || 0) * item.quantity
                              const taxAmount =
                                itemTotal * ((Number(item.taxRate) || 0) / 100)
                              const itemGrandTotal = itemTotal + taxAmount
                              return (
                                <TableRow
                                  key={item._id}
                                  className='hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                                >
                                  <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                                    {item.productName}
                                  </TableCell>
                                  <TableCell className='py-2'>
                                    <Input
                                      type='number'
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateQuantity(
                                          item._id,
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className='w-16 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-1 rounded-md'
                                      min='1'
                                    />
                                  </TableCell>
                                  <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                                    ₹{item.sellingPrice.toFixed(2)}
                                  </TableCell>
                                  <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                                    ₹{(taxAmount / item.quantity).toFixed(2)}
                                  </TableCell>
                                  <TableCell className='py-2 text-gray-900 dark:text-gray-100'>
                                    ₹{itemGrandTotal.toFixed(2)}
                                  </TableCell>
                                  <TableCell className='py-2'>
                                    <Button
                                      variant='ghost'
                                      onClick={() => removeFromCart(item._id)}
                                      className='text-red-600 hover:text-red-800'
                                    >
                                      Remove
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      <div className='text-right mb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          Total: ₹{calculateTotal().toFixed(2)}
                        </h3>
                      </div>

                      <div className='space-y-6'>
                        <div>
                          <Label htmlFor='paymentMode'>Payment Mode</Label>
                          <Select
                            onValueChange={setPaymentMode}
                            value={paymentMode}
                          >
                            <SelectTrigger className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'>
                              <SelectValue placeholder='Select payment mode' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='UPI'>UPI</SelectItem>
                              <SelectItem value='CASH'>Cash</SelectItem>
                              <SelectItem value='CARD'>Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor='customerName'>Customer Name</Label>
                          <Input
                            id='customerName'
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder='Enter customer name'
                            className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor='customerPhone'>Phone Number</Label>
                          <Input
                            id='customerPhone'
                            type='tel'
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder='Enter phone number'
                            className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                            required
                          />
                        </div>

                        {paymentMode === 'CASH' && (
                          <div className='space-y-2'>
                            <div>
                              <Label htmlFor='paidAmount'>
                                Customer Paid (₹)
                              </Label>
                              <Input
                                id='paidAmount'
                                type='number'
                                value={paidAmount}
                                onChange={(e) =>
                                  setPaidAmount(
                                    e.target.value ? Number(e.target.value) : ''
                                  )
                                }
                                placeholder='Enter amount paid'
                                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                                min='0'
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor='balance'>
                                Balance to Return (₹)
                              </Label>
                              <Input
                                id='balance'
                                type='number'
                                value={balance}
                                readOnly
                                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-200  dark:text-gray-900 p-2 rounded-md'
                              />
                            </div>
                          </div>
                        )}

                        <div className='flex space-x-4'>
                          <Button
                            onClick={handleCheckout}
                            className='bg-green-600 hover:bg-green-700 text-white flex-1'
                          >
                            Checkout
                          </Button>
                          <Button
                            onClick={generateInvoice}
                            className='bg-blue-600 hover:bg-blue-700 text-white flex-1'
                          >
                            Print Invoice
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
