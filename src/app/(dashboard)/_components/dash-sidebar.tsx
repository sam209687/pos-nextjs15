'use client' // Since we'll use state for collapse

import { useState } from 'react'
import { cn } from '@/lib/utils' // shadcn utility for classNames
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
  Percent,
  Package,
  Users,
  ShoppingCart,
  BarChart,
  FileText,
} from 'lucide-react' // Importing specific icons

export default function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menus = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Add Brands',
      url: 'add-brand',
      icon: PlusCircle,
    },
    {
      title: 'Add Category',
      url: 'add-category',
      icon: PlusCircle,
    },

    {
      title: 'Add Products',
      url: 'add-product',
      icon: Package,
    },
    {
      title: 'Add GST/HSN',
      url: 'tax',
      icon: Percent,
    },
    {
      title: 'Add Unit',
      url: 'add-unit',
      icon: Percent,
    },
    {
      title: 'Manage Cashiers',
      url: '/manage-cashiers',
      icon: Users,
    },
    {
      title: 'POS',
      url: 'pos',
      icon: ShoppingCart,
    },
    {
      title: 'Sales',
      url: '/sales',
      icon: BarChart,
    },
    {
      title: 'Manage Invoices',
      url: '/manage-invoices',
      icon: FileText,
    },
  ]

  return (
    <aside
      className={cn(
        'dark:bg-gray-900 bg-gray-50 dark:text-white h-screen p-4 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* User Icon and Collapse Toggle */}
      <div className='flex items-center justify-between mb-6'>
        <Avatar className={cn(isCollapsed ? 'block' : 'block')}>
          <AvatarImage src='https://github.com/shadcn.png' alt='User' />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='dark:text-white dark:hover:bg-gray-700 cursor-pointer h-15 w-15 rounded-full hover:bg-gray-200'
          aria-label='Toggle Sidebar'
          title='Toggle Sidebar'
          data-tooltip-id='tooltip'
          data-tooltip-content={isCollapsed ? 'Expand' : 'Collapse'}
          data-tooltip-place='right'
          data-tooltip-type='dark'
          data-tooltip-delay-show={100}
          data-tooltip-delay-hide={100}
          data-tooltip-offset={10}
          data-tooltip-arrow={true}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav>
        <ul className='space-y-2'>
          {menus.map((menu) => (
            <li key={menu.title}>
              <a
                href={menu.url}
                className={cn(
                  'flex items-center p-2 rounded-md hover:bg-gray-700',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <menu.icon className='w-6 h-6 mr-2' />
                {!isCollapsed && <span>{menu.title}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
