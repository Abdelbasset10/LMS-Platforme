'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect } from 'next/navigation'
import MobileNav from './MobileNav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import UserModeBtn from './UserModeBtn'
import { store } from '@/redux/store'
import { setUserInfo } from '@/redux/features/userSlice'
import { useEffect } from "react"
import { useAppDispatch } from "@/redux/hooks"

type Props = {
    user:any
    refreshToken:any
    accessToken:any
}

const Navbar = ({user,refreshToken,accessToken} : Props) => {
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(setUserInfo({user,refreshToken,accessToken}))
    })


    return (
        <div className='px-4 py-6 border-b h-full flex items-center justify-between' >
            <div className='md:hidden' >
                <MobileNav />
            </div>
            <div className='ml-auto flex items-center gap-2' >
                <UserModeBtn />
                <Avatar className='cursor-pointer' >
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback className='bg-slate-500/20' >{user?.name.toString().charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>  
                
            </div>
        </div>
    )
}

export default Navbar