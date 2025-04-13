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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function AddProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        setProducts(productsData || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete product with ID:', id)
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    console.log('Delete response status:', res.status)
    if (res.ok) {
      setProducts(products.filter((product) => product._id !== id))
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

  const handleAddProduct = () => {
    router.push('/add-product-details')
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
          <div className='flex justify-between items-center'>
            <CardTitle>Products</CardTitle>
            <Button
              onClick={handleAddProduct}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              Add Product
            </Button>
          </div>
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
