import { columns } from '@/components/dashboard/course/course/columns'
import { DataTable } from '@/components/dashboard/course/course/data-table'
import { Button } from '@/components/ui/button'
import handleFetch from '@/helpers/handleFetch'
import { Plus } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

const CoursesTeacherPage = async () => {
  const cookiesStore = cookies()

  const user = cookiesStore.get("user")
  const refToken = cookiesStore.get("refreshToken")
  const accessToken = cookiesStore.get("accessToken")

  const refreshToken = JSON.parse(refToken!.value)
  const parsedUser = JSON.parse(user?.value!)
  const parsedAccessToken = JSON.parse(accessToken!.value)


  const courses = await handleFetch(`/course/teacher/${parsedUser.id}`,"GET",undefined,refreshToken,parsedAccessToken)
  return (
    <div className='h-[calc(100vh-5rem)] overflow-y-auto' >
      <div className='px-6 py-4' >
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  )
}

export default CoursesTeacherPage