'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    category: z.string().min(1,{
        message:"Course category is required"
    }),
})

import { Pencil } from 'lucide-react'

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import toast from "react-hot-toast"
import handleFetch from "@/helpers/handleFetch"
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


type Props = {
    categoryId:string | null
    courseId:string
    categories : CategoryType[]
}

const CategoryForm = ({categoryId,courseId,categories}:Props) => {
    const category = categories.find((c : any)=>c.id === categoryId)
    const router = useRouter()
    const [isEditing,setIsEditing] = useState(false)
  
      const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: category?.name || "",
        },
    })

    const {isSubmitting} = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const categ = categories?.find((c : any)=>c.name === values.category)
            if(!categ){
                return toast.error("Category does not exists!")
            }
            const content = {
                categoryId:categ.id
            }
            const res = await handleFetch(`/course/${courseId}`,"PATCH",content,refreshToken,accessToken)
            if(res?.message){
                return toast.error(res.message)
            }
            setIsEditing(false)
            router.refresh()
            
        } catch (error) {
            toast.error("Something went wrong!")
        } 
    }
    

    return (
        <div className='p-4 rounded-lg bg-slate-100' >
            <div className='flex items-center justify-between' >
                <p className='font-bold' >Course category</p>
                <div className='flex items-center gap-1 text-slate-700 hover:text-sky-500 cursor-pointer' onClick={()=>setIsEditing((prev)=>!prev)} >
                    <Pencil />
                    <p>Edit category</p>
                </div>
            </div>
            {isEditing ? (
               <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 ">
                    <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="flex flex-col ">
                            <Popover >
                                <PopoverTrigger asChild className="bg-white z-50 border-white rounded-[6px] shadow-sm hover:border-sky-500 border" >
                                    <FormControl className="" >
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between ",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                        {field.value
                                            ? categories.find(
                                                (language : any) => language.name === field.value
                                            )?.name
                                            : "Select language"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-0" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 z-50 bg-white ">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." />
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {categories.map((language : any) => (
                                                <CommandItem
                                                className="bg-white z-50"
                                                    value={language.name}
                                                    key={language.name}
                                                    onSelect={() => {
                                                        form.setValue("category", language.name)
                                                    }}
                                                    >
                                                    <Check
                                                        className={cn(
                                                        "mr-2 h-4 w-4",
                                                        language.name === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                    />
                                                    {language.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                    />
                            <Button disabled={isSubmitting} type="submit" className="bg-sky-500 rounded-[6px] text-white hover:bg-sky-600" >Save</Button>
                </form>
             </Form>
            ) : (
                category ? (
                    <p className="mt-2" >{category.name}</p>
                ) : (
                    <p className="mt-2 italic text-sm" > No category</p>
                )
            )}
            
        </div>
    )
}

export default CategoryForm