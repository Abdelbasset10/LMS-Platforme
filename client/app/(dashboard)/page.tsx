import Categories from "@/components/dashboard/home/category/Categories"
import Courses from "@/components/dashboard/home/courses/Courses";
import handleFetch from "@/helpers/handleFetch"
import { cookies } from "next/headers"

const HomePage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const cookiesStore = cookies()

  const refToken = cookiesStore.get("refreshToken")
  const accessToken = cookiesStore.get("accessToken")
  const user = cookiesStore.get("user")

  const refreshToken = JSON.parse(refToken!.value)
  const parsedUser = JSON.parse(user!.value)
  const parsedAccessToken = JSON.parse(accessToken!.value)

  const categories : CategoryType[] = await handleFetch("/category","GET",undefined,refreshToken,parsedAccessToken)
  const courses : CourseType[] = await handleFetch(`/course/?category=${searchParams?.category}&name=${searchParams?.name}`,"GET",undefined,refreshToken,parsedAccessToken)
  
  return (
    <div className='h-[calc(100vh-5rem)] overflow-y-auto' >
        <div className="px-4 h-full py-2" >
          <Categories categories={categories} />
          {courses.length === 0 ? (
            <div className="px-4 py-2" >
              <p className="text-slate-500" >Ooops!. No courses found!</p>
            </div>
          ) : (
            <Courses courses={courses} userId={parsedUser.id} />
          )}
        </div>
      

    </div>
  )
}

export default HomePage