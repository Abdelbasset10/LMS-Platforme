'use client'
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

type Props = {
    route : {
        Icon: LucideIcon,
        label: string,
        href: string,
    }
}

const NavRoute = ({route} : Props) => {
    const pathname = usePathname()
    const isActive = pathname === route.href
    return (
        <div className={cn("p-4 flex items-center gap-2  text-slate-500 hover:text-slate-600 hover:bg-slate-300/20 cursor-pointer",isActive && "bg-sky-200/20 border-r-[3px] border-sky-500")} >
            <route.Icon />
            <p>{route.label}</p>
        </div>
    )
}

export default NavRoute