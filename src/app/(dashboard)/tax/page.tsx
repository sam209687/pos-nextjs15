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

interface Tax {
  _id: string
  name: string
  gst: string
}

export default function AddTaxPage() {
  const [tax, setTax] = useState<Tax[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [taxName, setTaxName] = useState('')
  const [taxGst, setTaxGst] = useState('')
  const [editTax, setEditTax] = useState<Tax | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taxToDelete, setTaxToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchTax()
  }, [])

  const fetchTax = async () => {
    const res = await fetch('/api/tax')
    const data = await res.json()
    setTax(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache',
      body: JSON.stringify({
        name: taxName,
        gst: taxGst,
      }),
    })
    if (res.ok) {
      setTaxName('')
      setTaxGst('')
      setIsOpen(false)
      fetchTax()
      console.log('The response is ', res)
    } else {
      const error = await res.json()
      console.error('Add failed:', error.message)
      console.log(`Failed to add tax: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete tax with ID:', id)
    const res = await fetch(`/api/tax/${id}`, {
      method: 'DELETE',
      cache: 'force-cache',
    })
    console.log('Delete response status:', res.status)
    if (res.ok) {
      fetchTax()
    } else {
      const error = await res.json()
      console.error('Delete failed:', error.message)
      alert(`Failed to delete tax: ${error.message}`)
    }
  }

  const handleEdit = (tax: Tax) => {
    setEditTax(tax)
    setTaxName(tax.name)
    setTaxGst(tax.gst)

    setEditOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editTax) {
      const res = await fetch(`/api/tax/${editTax._id}`, {
        method: 'PUT',
        cache: 'force-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taxName,
          description: taxGst,
        }),
      })
      if (res.ok) {
        setTaxName('')
        setTaxGst('')

        setEditTax(null)
        setEditOpen(false)
        fetchTax()
      } else {
        const error = await res.json()
        console.error('Update failed:', error.message)
        alert(`Failed to update tax: ${error.message}`)
      }
    }
  }

  const confirmDelete = (id: string) => {
    setTaxToDelete(id)
    setDeleteDialogOpen(true)
  }

  return (
    <div className='p-6 dark:bg-gray-900 bg-gray-100 min-h-screen'>
      <div className='pt-20'></div>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Manage Tax
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          View, add, edit, and delete tax efficiently.
        </p>
      </div>

      <Card className='w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700'>
          <div></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                Add GST
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
                  Tax Name
                </TableHead>
                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  GST
                </TableHead>

                <TableHead className='text-left text-gray-700 dark:text-gray-300'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tax.map((t, index) => (
                <TableRow
                  key={t._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                >
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {t.name}
                  </TableCell>
                  <TableCell className='py-4 text-gray-900 dark:text-gray-100'>
                    {t.gst}
                  </TableCell>

                  <TableCell className='py-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(t)}
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
                          onClick={() => confirmDelete(t._id)}
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
                            Are you sure you want to delete the tax "{t.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100'>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700 text-white'
                            onClick={async () => {
                              if (taxToDelete) {
                                console.log(
                                  'Confirming delete for ID:',
                                  taxToDelete
                                )
                                await handleDelete(taxToDelete)
                                setDeleteDialogOpen(false)
                                setTaxToDelete(null)
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
              Add New Tax
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className=''>
            {' '}
            {/* Increased gap with space-y-6 */}
            <div className='mb-5'>
              <Label
                htmlFor='taxName'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Tax Name
              </Label>
              <Input
                id='TaxName'
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder='Enter tax name'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <div className='mb-5'>
              <Label
                htmlFor='taxGst'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                GST
              </Label>
              <Input
                id='taxGst'
                value={taxGst}
                onChange={(e) => setTaxGst(e.target.value)}
                placeholder='Enter GST'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'
            >
              Save Tax
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='dark:bg-gray-800 max-w-md'>
          <DialogHeader className='pb-4'>
            <DialogTitle className='text-gray-900 dark:text-white'>
              Tax Name
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className='space-y-6'>
            <div className='mb-5'>
              <Label
                htmlFor='taxName'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                Tax Name
              </Label>
              <Input
                id='editTaxName'
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder='Enter tax name'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>
            <div className='mb-5'>
              <Label
                htmlFor='taxGst'
                className='text-gray-700 dark:text-gray-300 block mb-2'
              >
                GST
              </Label>
              <Input
                id='editTaxGst'
                value={taxGst}
                onChange={(e) => setTaxGst(e.target.value)}
                placeholder='Enter GST'
                className='w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md'
                required
              />
            </div>

            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'
            >
              Update Tax
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
