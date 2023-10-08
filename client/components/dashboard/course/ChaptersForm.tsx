'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    title: z.string().min(1,{
        message:"Chapter title is required"
    }),
})

import { Pencil, PlusCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import toast from "react-hot-toast"
import handleFetch from "@/helpers/handleFetch"
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import ChaptersList from "./ChaptersList"


type Props = {
    chapters:ChapterType[]
    courseId:string
}

const ChaptersForm = ({chapters,courseId}:Props) => {
    const router = useRouter()
    const [isEditing,setIsEditing] = useState(false)

    const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title:"",
        },
    })

    const {isSubmitting} = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await handleFetch(`/chapter/${courseId}`,"POST",values,refreshToken,accessToken)
            if(res?.message){
                return toast.error(res.message)
            }
            setIsEditing(false)
            form.reset()
            router.refresh()
            
        } catch (error) {
            toast.error("Something went wrong!")
        } 
    }
    

    return (
        <div className='p-4 rounded-lg bg-slate-100 h-fit' >
            <div className='flex items-center justify-between' >
                <p className='font-bold' >Course chapters</p>
                <div className='flex items-center gap-1 text-slate-700 hover:text-sky-500 cursor-pointer' onClick={()=>setIsEditing((prev)=>!prev)} >
                    <PlusCircle />
                    <p>Add chapter</p>
                </div>
            </div>
            {isEditing && (
                <Form {...form}  >
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 mt-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="e.g: 'Introduction" {...field} 
                                        className="bg-white border-white border rounded-lg"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button disabled={isSubmitting} type="submit" className="bg-sky-500 rounded-[6px] text-white hover:bg-sky-600" >Save</Button>
                    </form>
                </Form>
            )}
            {chapters.length === 0 ? (
                <p className="text-sm italic" >No chapters yet</p>
            ) : (
                <ChaptersList chapters={chapters} courseId={courseId} />
            )}
            
        </div>
    )
}

export default ChaptersForm