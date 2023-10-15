import { cookies, headers } from 'next/headers'
import Navbar from '@/components/dashboard/navbar/Navbar'
import Sidebar from '@/components/dashboard/sidebar/Sidebar'
import React from 'react'
import { redirect } from 'next/navigation'
import CourseSidebar from '@/components/dashboard/sidebar/CourseSidebar'
import handleFetch from '@/helpers/handleFetch'

type Props = {
    children:React.ReactNode,
    params:{
        courseId:string
    }
}

const CoursePageLayout = async ({children,params}:Props) => {
    const cookiesStore = cookies()
    const user = cookiesStore.get("user")
    const refreshToken = cookiesStore.get("refreshToken")
    const accessToken = cookiesStore.get("accessToken")
    
    if(!user || !refreshToken || !accessToken){
        return redirect("/auth/login")
    }

    const parsedUser = JSON.parse(user.value)
    const parsedRefreshToken = JSON.parse(refreshToken.value)
    const course : CourseType = await handleFetch(`/course/student/${params.courseId}`,"GET",undefined,parsedRefreshToken,accessToken)
    
    if(!course || course?.message){
        return redirect("/")
    }

    
    

    return (
        <div className='' >
            <div className='md:pl-64 fixed top-0 inset-y-0 h-20 w-full ' >
                <Navbar user={parsedUser} refreshToken={parsedRefreshToken} accessToken={accessToken.value}  />
            </div>
            <div className='hidden md:block fixed left-0 inset-y-0 w-64 h-full overflow-y-auto z-50' >
                <CourseSidebar userId={parsedUser.id} title={course.title} chapters={course.chapters}/>
            </div>
            <div className='md:pl-64 pt-20' >
                {children}
            </div>
        </div>
    )
}

export default CoursePageLayout