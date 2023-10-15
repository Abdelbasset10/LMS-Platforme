'use client'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux/hooks'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const UserModeBtn = () => {
    const pathname = usePathname()

  return (
    <div>
        {pathname === "/" ? (
            <Link href="/teacher/courses" >
                <Button variant="ghost" >Teacher mode</Button>
            </Link>
        ): (
            <Link href="/" >
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Exit
                </Button>
            </Link>
                
        )}
    </div>
  )
}

export default UserModeBtn