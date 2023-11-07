import { cookies } from 'next/headers'
import Navbar from '@/components/dashboard/navbar/Navbar'
import Sidebar from '@/components/dashboard/sidebar/Sidebar'
import React from 'react'
import { redirect } from 'next/navigation'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
    const cookiesStore = cookies()
    console.log(cookiesStore.get("user"))
    const user = cookiesStore.get("user")
    const refreshToken = cookiesStore.get("refreshToken")
    const accessToken = cookiesStore.get("accessToken")
    if(!user || !refreshToken || !accessToken){
        console.log("hello");
        return
    }
    const parsedUser = JSON.parse(user.value)
    const parsedRefreshToken = JSON.parse(refreshToken.value)

    

    return (
        <div className='' >
            <div className='md:pl-64 fixed top-0 inset-y-0 h-20 w-full ' >
                <Navbar user={parsedUser} refreshToken={parsedRefreshToken} accessToken={accessToken.value}  />
            </div>
            <div className='hidden md:block fixed left-0 inset-y-0 w-64 h-full overflow-y-auto z-50' >
                <Sidebar />
            </div>
            <div className='md:pl-64 pt-20' >
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout