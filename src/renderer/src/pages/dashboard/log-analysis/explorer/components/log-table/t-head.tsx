import React from 'react'
import { TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table'

const THead: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[15%]">Timestamp</TableHead>
        <TableHead className="text-left w-[50%] ">Error message</TableHead>
        <TableHead className="w-[10%] ">Method</TableHead>
        <TableHead className="w-[30%]">API endpoint</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export default THead
