import handleFetch from '@/helpers/handleFetch'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const page = async ({params}:{params:{courseId:string}}) => {
    const cookiesStore = cookies()
    const refreshToken = cookiesStore.get("refreshToken")
    const accessToken = cookiesStore.get("accessToken")
    const parsedRefreshToken = JSON.parse(refreshToken?.value!)

  const course : CourseType = await handleFetch(`/course/student/${params.courseId}`,"GET",undefined,parsedRefreshToken,accessToken)

  redirect(`/${course.id}/${course.chapters[0].id}`)

  return
}

export default page