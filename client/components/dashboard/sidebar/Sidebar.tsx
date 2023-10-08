'use client'
import Image from 'next/image'
import React from 'react'

import { Separator } from "@/components/ui/separator"
import NavRoute from './NavRoute'
import { Compass, Layout } from 'lucide-react'
import { studentRoutes, teacherRoutes } from './navs'
import { usePathname } from 'next/navigation'



const Sidebar = () => {
  const pathname = usePathname()
  return (
    <div className='w-full h-full border-r z-50 ' >
      <div className='h-20  px-4 py-6 border-b' >
        <Image src="/logo.svg" width={200} height={200} alt='logo image' />
      </div>
      <div className='flex flex-col' >
        {pathname.startsWith("/teacher") ? (
          teacherRoutes.map((route)=>(
            <NavRoute key={route.label} route={route} />
          ))
        ) : (
          studentRoutes.map((route)=>(
            <NavRoute key={route.label} route={route} />
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar