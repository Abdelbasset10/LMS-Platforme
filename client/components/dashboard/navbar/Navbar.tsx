'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect, usePathname, useRouter } from 'next/navigation'
import MobileNav from './MobileNav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import UserModeBtn from './UserModeBtn'
import { store } from '@/redux/store'
import { setUserInfo } from '@/redux/features/userSlice'
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/redux/hooks"
import SearchInput from "./SearchInput"
import toast from "react-hot-toast"

type Props = {
    user:any
    refreshToken:any
    accessToken:any
}

const Navbar = ({user,refreshToken,accessToken} : Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    const [isOpen,setIsOpen] = useState(false)

    const handleLogOut = async () => {
        const res = await fetch("https://lms-platforme-abdelbasset10.vercel.app/api/store/delete",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",  
                },
            })
            const data = await res.json()
            if(data !== "cookies has been deleted"){
                return toast.error("Something went wrong")
            }
            router.refresh()
    }

    useEffect(()=>{
        dispatch(setUserInfo({user,refreshToken,accessToken}))
    })



    return (
        <div className='px-4 py-6 border-b h-full flex items-center justify-between' >
            <div className='md:hidden mr-4' >
                <MobileNav />
            </div>
            {(pathname === "/" || pathname === "/dashboard") && (
                <SearchInput />
            )}
            <div className='ml-auto flex items-center gap-2' >
                <UserModeBtn />
                <div className="relative" >
                    <Avatar className='cursor-pointer' onClick={()=>setIsOpen((prev)=>!prev)} >
                        <AvatarImage src={user?.picture} />
                        <AvatarFallback className='bg-slate-500/20' >{user?.name.toString().charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar> 
                    {isOpen && (
                        <Button className="absolute top-10 right-4 bg-slate-300 hover:bg-slate-500 rounded-[8px]" onClick={handleLogOut} >LogOut</Button>
                    )}
                </div> 
                
            </div>
        </div>
    )
}

export default Navbar