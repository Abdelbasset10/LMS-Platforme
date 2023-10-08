import { AlertTriangle } from 'lucide-react'
import React from 'react'

type Props = {
    label:string
}

const Banner = ({label} : Props) => {
  return (
    <div className='w-full p-4 bg-yellow-200' >
        <div className='flex items-center gap-2' >
            <AlertTriangle />
            <p>{label}</p>
        </div>
    </div>
  )
}

export default Banner