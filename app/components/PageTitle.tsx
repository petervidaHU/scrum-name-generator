import React from 'react'
import '@/styles/globals.css'

interface PageTitleProps {
  title: string,
}

export const PageTitle: React.FC<PageTitleProps> = ({title}) => {
  return (
    <h1 className="my-6 font-bold text-2xl">{title}</h1>
  )
}
