"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<CourseType>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
        },
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const course = row.original
            const router = useRouter()
        
            return (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-50 bg-white" >
                    <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-200"
                    onClick={() => router.push(`/teacher/courses/${course.id}`)}
                    >
                    <Pencil size={18}  />
                    <p>Edit course</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
