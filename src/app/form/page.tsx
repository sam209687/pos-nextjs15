import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' // Correct import

export default function FormPage() {
  return (
    <div className='card max-w-7xl mx-auto h-auto mt-24 '>
      <div className='w-full bg-[#1e2838] mt-11 p-5'>
        <h1 className='text-2xl font bold'>Add Products</h1>
        <p className='text-xs text-gray-400 max-w-md'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos dolorum
          voluptates iste. Earum, at temporibus!
        </p>

        <form className='max-w-md mx-auto space-y-4'>
          {/* ... (rest of your form code remains the same) */}
          <div className='relative'>
            <Input
              type='email'
              id='floating_email'
              placeholder=' '
              required
              className='peer w-full'
            />
            <Label className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Email address
            </Label>
          </div>
          {/* ... (rest of your form code remains the same) */}
          <Button type='submit' className='w-full sm:w-auto'>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
