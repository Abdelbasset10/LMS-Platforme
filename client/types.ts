interface UserType {
    id:string
    name:string
    email:string
    picture : string | null
}

interface CourseType {
    id:string
    title:string
    description : string | null
    image : string | null
    price : string | null
    isPublished : boolean
    creatorId : string
    categoryId : string | null
    chapters : ChapterType[]
    message : string | null

}

interface ChapterType {
    id:string
    title:string
    description : string | null
    video : string | null
    position : number
    isPublished : boolean
    courseId : string
    muxData : MuxType | null
    message : string | null | undefined
}

interface MuxType {
    id:string
    assetId:string
    playbackId : string | null
    chapterId : string
}

interface CategoryType {
    id:string
    name:string
    courses : CourseType[]
}