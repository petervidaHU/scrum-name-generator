import React from 'react'

interface ListTableProps {
  list: any
}

export const ListTable: React.FC<ListTableProps> = ({list}) => {
  
  return (
    <div>
      list tables:
      {'    '}
      {JSON.stringify(list)}
    </div>
  )
}
