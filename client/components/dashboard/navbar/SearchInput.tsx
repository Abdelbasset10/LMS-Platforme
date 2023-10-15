'use client'

import qs from 'query-string'
import React, { useState } from 'react'
import { Search } from 'lucide-react'
import handleFetch from '@/helpers/handleFetch'
import { useAppSelector } from '@/redux/hooks'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchInput = () => {
  const searchParams = useSearchParams()
  const router = useRouter()



  const [search,setSearch] = useState("")


  const handleSearch = async (e:any) => {
    e.preventDefault()
    const queries = qs.parse(searchParams.toString())
    const updatedQueries = {...queries,name:search}

    if(queries.name && !search){
      //@ts-ignore
      delete updatedQueries.name
    }
    const url = qs.stringifyUrl({
      url:"/",
      query:updatedQueries
    })
    router.push(url)

    
    
  }

  return (
    <form className='sm:w-72 w-56 flex items-center space-x-2 bg-slate-200 px-4 py-2 border rounded-xl' onSubmit={handleSearch} >
        <Search className='text-slate-500'  />
        <input className='w-full bg-transparent outline-none text-slate-500' placeholder='Search for a course' onChange={(e:any)=>setSearch(e.target.value)} />
    </form>
  )
}

export default SearchInput