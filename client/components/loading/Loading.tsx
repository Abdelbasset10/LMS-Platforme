import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-full h-full flex items-center justify-center' >
        <Loader2 className='animate-spin text-sky-500' size={100} />
    </div>
  )
}

export default Loading