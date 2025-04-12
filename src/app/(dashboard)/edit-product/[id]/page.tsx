'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import QRCode from 'qrcode'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Product {
  _id: string
  productName: string
  productCode: number
  productDescription: string
  brand: string
  category: string
  tax: string
  sellingPrice: number
  productionPrice: number
  unit: string
  totalQty: number
  alertQty: number
  qrCode: string
}

interface Brand {
  _id: string
  name: string
}

interface Category {
  _id: string
  name: string
}

interface Tax {
  _id: string
  name: string
  gst: number
}

interface Unit {
  _id: string
  name: string
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [productName, setProductName] = useState('')
  const [productCode, setProductCode] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [tax, setTax] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [productionPrice, setProductionPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [totalQty, setTotalQty] = useState('')
  const [alertQty, setAlertQty] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    const [brandsRes, categoriesRes, taxRes, unitsRes, productRes] =
      await Promise.all([
        fetch('/api/brands'),
        fetch('/api/category'),
        fetch('/api/tax'),
        fetch('/api/unit'),
        fetch(`/api/products/${id}`),
      ])
    const [brandsData, categoriesData, taxData, unitsData, productData] =
      await Promise.all([
        brandsRes.json(),
        categoriesRes.json(),
        taxRes.json(),
        unitsRes.json(),
        productRes.json(),
      ])
    setBrands(brandsData)
    setCategories(categoriesData)
    setTax(taxData)
    setUnits(unitsData)
    setProduct(productData)
    setProductName(productData.productName)
    setProductCode(productData.productCode.toString())
    setProductDescription(productData.productDescription)
    setBrand(productData.brand)
    setCategory(productData.category)
    setTax(productData.tax)
    setSellingPrice(productData.sellingPrice.toString())
    setProductionPrice(productData.productionPrice.toString())
    setUnit(productData.unit)
    setTotalQty(productData.totalQty.toString())
    setAlertQty(productData.alertQty.toString())
    setQrCode(productData.qrCode)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = parseInt(productCode)
    if (code < 1 || code > 999) {
      alert('Product code must be between 0001 and 999!')
      return
    }
    if (product) {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productCode: code,
          productDescription,
          brand,
          category,
          tax,
          sellingPrice: parseFloat(sellingPrice),
          productionPrice: parseFloat(productionPrice),
          unit,
          totalQty: parseInt(totalQty),
          alertQty: parseInt(alertQty),
          qrCode: qrCode || '',
        }),
      })
      if (res.ok) {
        router.push('/dashboard/add-product')
      } else {
        const error = await res.json()
        console.error('Update failed:', error.message)
        alert(`Failed to update product: ${error.message}`)
      }
    }
  }

  const generateQRCode = () => {
    if (!productName || !productCode) {
      alert('Product Name and Product Code are required to generate QR Code!')
      return
    }
    const codeData = `${productName}-${productCode}`
    QRCode.toDataURL(codeData, (err, url) => {
      if (err) {
        console.error('QR Code generation failed:', err)
        alert('Failed to generate QR Code!')
      } else {
        setQrCode(url)
      }
    })
  }

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a')
      link.href = qrCode
      link.download = `${productName}-${productCode}-qrcode.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className='p-6 dark:bg-gray-900 bg-gray-100 min-h-screen'>
      <div className='pt-20'></div>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Edit Product
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Update product details and inventory information.
        </p>
      </div>

      <Card className='w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='p-6'>
          <Button
            onClick={() => router.push('/dashboard/add-product')}
            className='bg-gray-500 hover:bg-gray-600 text-white'
          >
            Back
          </Button>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleUpdate} className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Row 1 */}
              <div>
                <Label
                  htmlFor='editProductName'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Product Name
                </Label>
                <Input
                  id='editProductName'
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder='Enter product name'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='editProductCode'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Product Code
                </Label>
                <Input
                  id='editProductCode'
                  type='number'
                  value={productCode}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    if (value >= 1 && value <= 999) {
                      setProductCode(value.toString())
                    } else {
                      alert('Product code must be between 0001 and 999!')
                    }
                  }}
                  placeholder={`Current: ${productCode}`}
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='editProductDescription'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Product Description
                </Label>
                <Textarea
                  id='editProductDescription'
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder='Enter product description'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md h-12'
                  required
                />
              </div>

              {/* Row 2 */}
              <div>
                <Label
                  htmlFor='editBrand'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Brand
                </Label>
                <Select onValueChange={setBrand} value={brand} required>
                  <SelectTrigger className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'>
                    <SelectValue placeholder='Select a brand' />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b._id} value={b._id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='editCategory'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Category
                </Label>
                <Select onValueChange={setCategory} value={category} required>
                  <SelectTrigger className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='editTax'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  GST
                </Label>
                <Select onValueChange={setTax} value={tax} required>
                  <SelectTrigger className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'>
                    <SelectValue placeholder='Select GST' />
                  </SelectTrigger>
                  <SelectContent>
                    {taxes.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name}
                      </SelectItem>
                    ))}
                    {taxes.length === 0 && (
                      <SelectItem value='no-taxes' disabled>
                        No taxes available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3 - Inventory Management Fields */}
              <Separator className='col-span-3 my-6'>
                <span className='text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2'>
                  Inventory Management Fields
                </span>
              </Separator>
              <div>
                <Label
                  htmlFor='editSellingPrice'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Selling Price
                </Label>
                <Input
                  id='editSellingPrice'
                  type='number'
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder='Enter selling price'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='editProductionPrice'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Production Price
                </Label>
                <Input
                  id='editProductionPrice'
                  type='number'
                  value={productionPrice}
                  onChange={(e) => setProductionPrice(e.target.value)}
                  placeholder='Enter production price'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='editUnit'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Unit
                </Label>
                <Select onValueChange={setUnit} value={unit} required>
                  <SelectTrigger className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'>
                    <SelectValue placeholder='Select a unit' />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4 */}
              <div>
                <Label
                  htmlFor='editTotalQty'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Total Quantity
                </Label>
                <Input
                  id='editTotalQty'
                  type='number'
                  value={totalQty}
                  onChange={(e) => setTotalQty(e.target.value)}
                  placeholder='Enter total quantity'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='editAlertQty'
                  className='text-gray-700 dark:text-gray-300 block mb-2'
                >
                  Alert Quantity
                </Label>
                <Input
                  id='editAlertQty'
                  type='number'
                  value={alertQty}
                  onChange={(e) => setAlertQty(e.target.value)}
                  placeholder='Enter alert quantity'
                  className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                  required
                />
              </div>
              <div className='col-span-1'></div>
            </div>

            {/* QR Code Section */}
            <div className='mt-6'>
              <Button
                type='button'
                onClick={generateQRCode}
                className='bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md mb-4'
              >
                Generate QR Code
              </Button>
              {qrCode && (
                <div className='flex flex-col items-center mb-6'>
                  <img src={qrCode} alt='QR Code' className='w-32 h-32 mb-2' />
                  <Button
                    onClick={downloadQRCode}
                    className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md'
                  >
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>

            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-6'
            >
              Update Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
