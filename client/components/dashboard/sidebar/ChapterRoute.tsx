'use client'
import { cn } from "@/lib/utils"
import { Youtube } from "lucide-react"
import { useParams, useRouter} from "next/navigation"

type Props = {
    chapter:ChapterType
    userId:string
}

const ChapterRoute = ({chapter,userId} : Props) => {
    const isChapterCompleted = chapter.userProgresses.some((c)=>c.chapterId === chapter.id && c.isCompleted === true && c.userId === userId)
    const router = useRouter()
    const params = useParams()
    const courseId = params.courseId
    const chapterId = params.chapterId
    const isActive = chapter.id === params.chapterId
    return (
        <div className={cn("p-4 flex items-center gap-2  text-slate-500 hover:text-slate-600 hover:bg-slate-300/20 cursor-pointer",isActive && "bg-blue-200/20 border-r-[3px] border-blue-500",isChapterCompleted && "bg-green-300 text-white")} onClick={()=>router.push(`/${courseId}/${chapter.id}`)} >
            <Youtube />
            <p>{chapter.title}</p>
        </div>
    )
}

export default ChapterRoute