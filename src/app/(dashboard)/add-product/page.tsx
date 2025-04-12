'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'

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
  gst: string
}

interface Unit {
  _id: string
  name: string
}

export default function AddProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([]) // Changed from gsthsns
  const [units, setUnits] = useState<Unit[]>([])
  const [nextProductCode, setNextProductCode] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  async function fetchData(
    setBrands: React.Dispatch<React.SetStateAction<Brand[]>>,
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
    setTaxes: React.Dispatch<React.SetStateAction<Tax[]>>, // Changed from setGsthsns
    setUnits: React.Dispatch<React.SetStateAction<Unit[]>>,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    setNextProductCode: React.Dispatch<React.SetStateAction<number>>
  ) {
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
      setTaxes(taxData || []) // Changed from setGsthsns
      setUnits(unitData || [])
      setProducts(productsData || [])

      const maxCode = productsData.reduce(
        (max: number, product: Product) => Math.max(max, product.productCode),
        0
      )
      setNextProductCode(maxCode + 1)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchData(
      setBrands,
      setCategories,
      setTaxes, // Changed from setGsthsns
      setUnits,
      setProducts,
      setNextProductCode
    )
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error in useEffect fetch:', error)
        setIsLoading(false)
      })
  }, [])

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const code = parseInt(productCode) || nextProductCode
  //   if (code < 1 || code > 999) {
  //     alert('Product code must be between 0001 and 999!')
  //     return
  //   }

  //   if (
  //     !productName ||
  //     !brand ||
  //     !category ||
  //     !tax ||
  //     !unit ||
  //     !sellingPrice ||
  //     !productionPrice ||
  //     !totalQty ||
  //     !alertQty
  //   ) {
  //     alert('All fields are required!')
  //     return
  //   }

  //   const requestData = {
  //     productName,
  //     productCode: code,
  //     productDescription: productDescription || '',
  //     brand,
  //     category,
  //     tax,
  //     sellingPrice: parseFloat(sellingPrice),
  //     productionPrice: parseFloat(productionPrice),
  //     unit,
  //     totalQty: parseInt(totalQty),
  //     alertQty: parseInt(alertQty),
  //     qrCode: qrCode || '',
  //   }
  //   console.log('Submitting product data:', requestData)

  //   try {
  //     const res = await fetch('/api/products', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(requestData),
  //     })
  //     console.log('POST Response status:', res.status)
  //     const responseData = await res.json().catch((err) => {
  //       console.error('Failed to parse POST response:', err)
  //       return { message: 'Unknown error' }
  //     })
  //     console.log('POST Response data:', responseData)

  //     if (res.ok) {
  //       setProductName('')
  //       setProductCode('')
  //       setProductDescription('')
  //       setBrand('')
  //       setCategory('')
  //       setTax('')
  //       setSellingPrice('')
  //       setProductionPrice('')
  //       setUnit('')
  //       setTotalQty('')
  //       setAlertQty('')
  //       setQrCode(null)
  //       setIsOpen(false)
  //       console.log('Refreshing data after successful submission...')
  //       await fetchData(
  //         setBrands,
  //         setCategories,
  //         setTaxes, // Changed from setGsthsns
  //         setUnits,
  //         setProducts,
  //         setNextProductCode
  //       )
  //       console.log('Data refresh completed')
  //     } else {
  //       console.error('Add failed:', responseData.message)
  //       alert(`Failed to add product: ${responseData.message}`)
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error)
  //     alert('An error occurred while submitting the form.')
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = parseInt(productCode, 10) // Parse the formatted string (e.g., "001" -> 1)
    if (isNaN(code) || code < 1 || code > 999) {
      alert('Product code must be between 001 and 999!')
      return
    }

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
      productCode: code, // Use the parsed number
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
    console.log('Submitting product data:', requestData)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })
      console.log('POST Response status:', res.status)
      const responseData = await res.json().catch((err) => {
        console.error('Failed to parse POST response:', err)
        return { message: 'Unknown error' }
      })
      console.log('POST Response data:', responseData)

      if (res.ok) {
        setProductName('')
        setProductCode('') // Reset to empty
        setProductDescription('')
        setBrand('')
        setCategory('')
        setTax('')
        setSellingPrice('')
        setProductionPrice('')
        setUnit('')
        setTotalQty('')
        setAlertQty('')
        setQrCode(null)
        setIsOpen(false)
        console.log('Refreshing data after successful submission...')
        await fetchData(
          setBrands,
          setCategories,
          setTaxes,
          setUnits,
          setProducts,
          setNextProductCode
        )
        console.log('Data refresh completed')
      } else {
        console.error('Add failed:', responseData.message)
        alert(`Failed to add product: ${responseData.message}`)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('An error occurred while submitting the form.')
    }
  }

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete product with ID:', id)
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    console.log('Delete response status:', res.status)
    if (res.ok) {
      fetchData(
        setBrands,
        setCategories,
        setTaxes, // Changed from setGsthsns
        setUnits,
        setProducts,
        setNextProductCode
      )
    } else {
      const error = await res.json()
      console.error('Delete failed:', error.message)
      alert(`Failed to delete product: ${error.message}`)
    }
  }

  const confirmDelete = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
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
      <div className='pt-20'></div>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Manage Products
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Add, edit, and manage products with inventory details.
        </p>
      </div>

      <Card className='w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent
              suppressHydrationWarning
              className='dark:bg-gray-800 max-w-7xl'
            >
              <DialogHeader className='pb-4'>
                <DialogTitle className='text-gray-900 dark:text-white'>
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              {brands.length > 0 &&
              categories.length > 0 &&
              taxes.length > 0 &&
              units.length > 0 ? (
                <form onSubmit={handleSubmit} className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* Row 1 */}
                    <div>
                      <Label
                        htmlFor='productName'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Product Name
                      </Label>
                      <Input
                        id='productName'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder='Enter product name'
                        className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='productCode'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Product Code
                      </Label>
                      <Input
                        id='productCode'
                        type='text'
                        value={productCode}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value === '') {
                            setProductCode('')
                            return
                          }
                          const num = parseInt(value, 10)
                          if (num >= 1 && num <= 999) {
                            setProductCode(num.toString().padStart(3, '0'))
                          } else if (num > 999) {
                            alert('Product code must be between 001 and 999!')
                            setProductCode('999')
                          }
                        }}
                        onBlur={() => {
                          if (
                            productCode === '' ||
                            parseInt(productCode, 10) < 1
                          ) {
                            setProductCode(
                              nextProductCode.toString().padStart(3, '0')
                            )
                          }
                        }}
                        placeholder={`Next available: ${nextProductCode
                          .toString()
                          .padStart(3, '0')}`}
                        className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='productDescription'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Product Description
                      </Label>
                      <Textarea
                        id='productDescription'
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
                        htmlFor='brand'
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
                          {brands.length === 0 && (
                            <SelectItem value='no-brand' disabled>
                              No brands available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor='category'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Category
                      </Label>
                      <Select
                        onValueChange={setCategory}
                        value={category}
                        required
                      >
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
                    <div>
                      <Label
                        htmlFor='tax'
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
                    <div className='col-span-full'>
                      <Separator className='my-6'>
                        <span className='text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2'>
                          Inventory Management Fields
                        </span>
                      </Separator>
                    </div>
                    <div>
                      <Label
                        htmlFor='sellingPrice'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Selling Price
                      </Label>
                      <Input
                        id='sellingPrice'
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
                        htmlFor='productionPrice'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Production Price
                      </Label>
                      <Input
                        id='productionPrice'
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
                        htmlFor='unit'
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
                          {units.length === 0 && (
                            <SelectItem value='no-units' disabled>
                              No units available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 4 */}
                    <div>
                      <Label
                        htmlFor='totalQty'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Total Quantity
                      </Label>
                      <Input
                        id='totalQty'
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
                        htmlFor='alertQty'
                        className='text-gray-700 dark:text-gray-300 block mb-2'
                      >
                        Alert Quantity
                      </Label>
                      <Input
                        id='alertQty'
                        type='number'
                        value={alertQty}
                        onChange={(e) => setAlertQty(e.target.value)}
                        placeholder='Enter alert quantity'
                        className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                        required
                      />
                    </div>
                    <div className='hidden lg:block'></div>
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
                        <img
                          src={qrCode}
                          alt='QR Code'
                          className='w-32 h-32 mb-2'
                        />
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
                    Add Product
                  </Button>
                </form>
              ) : (
                <div className='p-6 text-center text-gray-600 dark:text-gray-400'>
                  Loading data...
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className='p-6'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-100 dark:bg-gray-700'>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Number
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Product Name
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Product Code
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Description
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                >
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {product.productName}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {product.productCode}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {product.productDescription}
                  </TableCell>
                  <TableCell className='py-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() =>
                        router.push(`/edit-product/${product._id}`)
                      }
                      className='mr-2 text-blue-600 hover:text-blue-800'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => confirmDelete(product._id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-6 w-6 text-red-400' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='dark:bg-gray-800'>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='text-gray-900 dark:text-white'>
                            Confirm Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription className='text-gray-600 dark:text-gray-400'>
                            Are you sure you want to delete the product "
                            {product.productName}"? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100'>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700 text-white'
                            onClick={async () => {
                              if (productToDelete) {
                                console.log(
                                  'Confirming delete for ID:',
                                  productToDelete
                                )
                                await handleDelete(productToDelete)
                                setDeleteDialogOpen(false)
                                setProductToDelete(null)
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
