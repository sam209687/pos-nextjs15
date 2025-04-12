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
import { Trash2, Edit } from 'lucide-react'
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

interface Category {
  _id: string
  name: string
  description: string
}

export default function AddCategoryPage() {
  const [categoryies, setCategory] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    const res = await fetch('/api/category')
    const data = await res.json()
    setCategory(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription,
      }),
    })
    if (res.ok) {
      setCategoryName('')
      setCategoryDescription('')

      setIsOpen(false)
      fetchCategory()
    } else {
      const error = await res.json()
      console.error('Add failed:', error.message)
      alert(`Failed to add category: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete category with ID:', id)
    const res = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
    })
    console.log('Delete response status:', res.status)
    if (res.ok) {
      fetchCategory()
    } else {
      const error = await res.json()
      console.error('Delete failed:', error.message)
      alert(`Failed to delete category: ${error.message}`)
    }
  }

  const handleEdit = (category: Category) => {
    setEditCategory(category)
    setCategoryName(category.name)
    setCategoryDescription(category.description)

    setEditOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editCategory) {
      const res = await fetch(`/api/category/${editCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
        }),
      })
      if (res.ok) {
        setCategoryName('')
        setCategoryDescription('')

        setEditCategory(null)
        setEditOpen(false)
        fetchCategory()
      } else {
        const error = await res.json()
        console.error('Update failed:', error.message)
        alert(`Failed to update category: ${error.message}`)
      }
    }
  }

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  return (
    <div className='p-6 dark:bg-gray-900 bg-gray-100 min-h-screen'>
      <div className='pt-20'></div>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Manage Category
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          View, add, edit, and delete category efficiently.
        </p>
      </div>

      <Card className='w-full max-w-8xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700'>
          <div></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                Add Category
              </Button>
            </DialogTrigger>
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
                  Category Name
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Category Description
                </TableHead>

                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryies.map((category, index) => (
                <TableRow
                  key={category._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                >
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {category.name}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {category.description}
                  </TableCell>

                  <TableCell className='py-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(category)}
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
                          onClick={() => confirmDelete(category._id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='dark:bg-gray-800'>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='text-gray-900 dark:text-white'>
                            Confirm Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription className='text-gray-600 dark:text-gray-400'>
                            Are you sure you want to delete the category "
                            {category.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100'>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700 text-white'
                            onClick={async () => {
                              if (categoryToDelete) {
                                console.log(
                                  'Confirming delete for ID:',
                                  categoryToDelete
                                )
                                await handleDelete(categoryToDelete)
                                setDeleteDialogOpen(false)
                                setCategoryToDelete(null)
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='dark:bg-gray-800 max-w-md'>
          <DialogHeader className='pb-4'>
            <DialogTitle className='text-gray-900 dark:text-white'>
              Add New Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className=''>
            {' '}
            {/* Increased gap with space-y-6 */}
            <div className='mb-5'>
              <Label
                htmlFor='categoryName'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Category Name
              </Label>
              <Input
                id='CategoryName'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder='Enter Category name'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <div className='mb-5'>
              <Label
                htmlFor='CategoryDescription'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Category Description
              </Label>
              <Input
                id='categoryDescription'
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder='Enter description'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'
            >
              Save Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='dark:bg-gray-800 max-w-md'>
          <DialogHeader className='pb-4'>
            <DialogTitle className='text-gray-900 dark:text-white'>
              Category Name
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className='space-y-6'>
            <div className='mb-5'>
              <Label
                htmlFor='CategoryName'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Category Name
              </Label>
              <Input
                id='editCategoryName'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder='Enter category name'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <div className='mb-5'>
              <Label
                htmlFor='CategoryDescription'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Category Description
              </Label>
              <Input
                id='editCategoryDescription'
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder='Enter description'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>

            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'
            >
              Update Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
