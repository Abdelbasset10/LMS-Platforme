'use client'
import { Menu } from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Sidebar from '../sidebar/Sidebar'

const MobileNav = () => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Menu />
        </SheetTrigger>
        <SheetContent side="left">
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileNav