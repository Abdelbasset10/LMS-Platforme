import React from 'react'
import Category from './Category'

type Props = {
    categories : CategoryType[]
}

const Categories = ({categories} : Props) => {
  return (
    <div className='flex items-center gap-4 overflow-x-auto pb-2 mb-4' >
       {categories?.map((category,index)=>(
          <Category key={index} category={category} />
       ))} 
    </div>
  )
}

export default Categories