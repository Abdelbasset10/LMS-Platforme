'use client'

import React from 'react'
import qs from 'query-string'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
    category : CategoryType
}

const Category = ({category} : Props) => {
    const router = useRouter()
    const params = useSearchParams()
    const pathname=usePathname()
    
    

    const handleQuery = () => {
        let currentQuery = {};
    
        if (params) {
          currentQuery = qs.parse(params.toString()) // get all queries
        } 
        const updatedQuery: any = {
            ...currentQuery,
            category: category.name
        } // add category query to the queries
    
        if (params?.get('category') === category.name) {
            delete updatedQuery.category;
        }
    
        const url = qs.stringifyUrl({
            url: pathname === "/" ? "/" :"/dashboard",
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }

  return (
    <div className={cn('border-slate-500 min-w-[7em] rounded-xl px-4 p-2 text-center bg-slate-100 hover:bg-slate-300 cursor-pointer',params?.get("category") === category.name && "bg-slate-400 text-white")} onClick={handleQuery}  >
        <p>{category.name}</p>
    </div>
  )
}

export default Category