'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { getCookie, getCookies } from 'cookies-next';

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

import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import handleFetch from "@/helpers/handleFetch";
import toast from "react-hot-toast";
const formSchema = z.object({
    title: z.string().min(1),
})

const page = () => {
    const router = useRouter()
    const {refreshToken,accessToken,user} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    const {isValid, isSubmitting} = form.formState

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        const courseInfo = {
            title:values.title,
            creatorId:user.id
        }
        try {
            const res = await handleFetch("/course/create","POST",courseInfo,refreshToken,accessToken)
            toast.success(`${res.title} course has been created succefully!`)
            router.push(`/teacher/courses/${res.id}`)
        } catch (error) {
            toast.error("something went wrong!")
        }
    }


    return (
        <div className='h-[calc(100vh-5rem)] flex items-center justify-center overflow-y-auto'>
            <div>
                <h1 className='text-xl font-bold' >Name your course</h1>
                <p className='text-slate-500 mb-2' >What would you like to name your course?Don't worry,you change this later!</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="font-bold" >Course title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g: 'Advanced React'" {...field} 
                                    className="focus:border-sky-700 focus:border-[2px] text-slate-500 focus:text-slate-800 rounded-[6px] border border-neutral-500 px-4"
                                />
                            </FormControl>
                            <FormDescription className="text-slate-500" >
                                What will you teach in this course ?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-2" >
                            <Button disabled={isSubmitting} type="button" className="hover:text-red-500" onClick={()=>router.push("/teacher/courses")} >Cancel</Button>
                            <Button type="submit" disabled={!isValid || isSubmitting} className="bg-sky-200 hover:bg-sky-500 cursor-pointer rounded-[6px]" >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page