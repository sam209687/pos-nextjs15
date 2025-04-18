'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'
import { generateProductCode } from '@/lib/product-code'

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
  gst: string
}

interface Unit {
  _id: string
  name: string
}

export default function AddProductDetails() {
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
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoryRes, taxRes, unitRes, productsRes] =
          await Promise.all([
            fetch('/api/brands'),
            fetch('/api/category'),
            fetch('/api/tax'),
            fetch('/api/unit'),
            fetch('/api/products'),
          ])

        const [brandsData, categoryData, taxData, unitData, productsData] =
          await Promise.all([
            brandsRes.json(),
            categoryRes.json(),
            taxRes.json(),
            unitRes.json(),
            productsRes.json(),
          ])

        setBrands(brandsData || [])
        setCategories(categoryData || [])
        setTaxes(taxData || [])
        setUnits(unitData || [])

        // Generate initial product code based on the first category or default
        const existingCodes = productsData.map((p: any) => p.productCode) || []
        if (categoryData.length > 0) {
          const initialCode = generateProductCode(
            categoryData[0].name,
            existingCodes
          )
          setProductCode(initialCode)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (category) {
      const fetchProducts = async () => {
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        const existingCodes = productsData.map((p: any) => p.productCode) || []
        const selectedCategory =
          categories.find((c) => c._id === category)?.name || ''
        const newCode = generateProductCode(selectedCategory, existingCodes)
        setProductCode(newCode)
      }
      fetchProducts()
    }
  }, [category, categories])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'productName') setProductName(value)
    else if (name === 'productDescription') setProductDescription(value)
    else if (name === 'sellingPrice') setSellingPrice(value)
    else if (name === 'productionPrice') setProductionPrice(value)
    else if (name === 'totalQty') setTotalQty(value)
    else if (name === 'alertQty') setAlertQty(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !productName ||
      !brand ||
      !category ||
      !tax ||
      !unit ||
      !sellingPrice ||
      !productionPrice ||
      !totalQty ||
      !alertQty
    ) {
      alert('All fields are required!')
      return
    }

    const requestData = {
      productName,
      productCode, // Save the full string (e.g., "BT001") instead of parsing
      productDescription: productDescription || '',
      brand,
      category,
      tax,
      sellingPrice: parseFloat(sellingPrice),
      productionPrice: parseFloat(productionPrice),
      unit,
      totalQty: parseInt(totalQty),
      alertQty: parseInt(alertQty),
      qrCode: qrCode || '',
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      if (res.ok) {
        alert('Product added successfully!')
        router.push('/dashboard/add-product')
      } else {
        const error = await res.json()
        alert(`Failed to add product: ${error.message}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('An error occurred while submitting the form.')
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

  if (isLoading) {
    return (
      <div className='p-6 text-center text-gray-600 dark:text-gray-400'>
        Loading...
      </div>
    )
  }

  return (
    <div className='p-6 dark:bg-gray-900 bg-gray-100 min-h-screen'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-1'>
          Add Product
        </h1>
        <p className='text-gray-600 text-xs'>Lorem ipsum dolor sit amet.</p>
        <form onSubmit={handleSubmit} className=' mt-6'>
          {/* Row 1: Product Name and Category */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Label
                htmlFor='productName'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Product Name
              </Label>
              <Input
                id='productName'
                name='productName'
                value={productName}
                onChange={handleChange}
                placeholder='Enter product name'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <div>
              <Label
                htmlFor='category'
                className='text-gray-700 dark:text-gray-600 block mb-2'
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
                  {categories.length === 0 && (
                    <SelectItem value='no-category' disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Product Description (full width) */}
          <div className='mt-5'>
            <Label
              htmlFor='productDescription'
              className='text-gray-700 dark:text-gray-600 block mb-2'
            >
              Product Description
            </Label>
            <Textarea
              id='productDescription'
              name='productDescription'
              value={productDescription}
              onChange={handleChange}
              placeholder='Enter product description'
              className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md h-24'
              required
            />
          </div>

          {/* Row 3: Product Code and Brand */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
            <div>
              <Label
                htmlFor='productCode'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Product Code
              </Label>
              <Input
                id='productCode'
                value={productCode}
                readOnly // Make it non-editable
                placeholder={productCode || 'Auto-assigned based on category'}
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-200 dark:text-gray-900 p-2 rounded-md cursor-not-allowed'
              />
            </div>
            <div>
              <Label
                htmlFor='brand'
                className='text-gray-700 dark:text-gray-600 block mb-2'
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
                  {brands.length === 0 && (
                    <SelectItem value='no-brand' disabled>
                      No brands available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: GST */}
          <div className='mt-5'>
            <Label
              htmlFor='tax'
              className='text-gray-700 dark:text-gray-600 block mb-2'
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
          <div className='col-span-full mt-5'>
            <span className='text-muted text-xs dark:text-muted bg-white dark:bg-purple-300 px-3 py-2 rounded-md'>
              Inventory Management Fields
            </span>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5'>
            <div>
              <Label
                htmlFor='sellingPrice'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Selling Price
              </Label>
              <Input
                id='sellingPrice'
                name='sellingPrice'
                type='number'
                value={sellingPrice}
                onChange={handleChange}
                placeholder='Enter selling price'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>

            <div>
              <Label
                htmlFor='productionPrice'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Production Price
              </Label>
              <Input
                id='productionPrice'
                name='productionPrice'
                type='number'
                value={productionPrice}
                onChange={handleChange}
                placeholder='Enter production price'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>

            <div>
              <Label
                htmlFor='unit'
                className='text-gray-700 dark:text-gray-600 block mb-2'
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
                  {units.length === 0 && (
                    <SelectItem value='no-units' disabled>
                      No units available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Total quantity field */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
            <div>
              <Label
                htmlFor='totalQty'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Total Quantity
              </Label>
              <Input
                id='totalQty'
                name='totalQty'
                type='number'
                value={totalQty}
                onChange={handleChange}
                placeholder='Enter total quantity'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>

            {/* Alert Quantity */}
            <div>
              <Label
                htmlFor='alertQty'
                className='text-gray-700 dark:text-gray-600 block mb-2'
              >
                Alert Quantity
              </Label>
              <Input
                id='alertQty'
                name='alertQty'
                type='number'
                value={alertQty}
                onChange={handleChange}
                placeholder='Enter alert quantity'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
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

          <div className='mt-6'>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mb-3'
            >
              Add Product
            </Button>
            <Button
              type='button'
              onClick={() => router.push('/dashboard/add-product')}
              className='bg-gray-600 hover:bg-gray-700 text-white w-full py-2 rounded-md'
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
