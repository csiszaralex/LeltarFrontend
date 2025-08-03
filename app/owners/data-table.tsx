'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useState } from 'react';
import { FaArrowAltCircleRight, FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '../components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  editOwner: (owner: TData) => void;
  setOwnerToDelete: (owner: TData) => void;
  goOwner: (id: number) => void;
}

interface WithId {
  id: number;
}

export function DataTable<TData extends WithId, TValue>({
  columns,
  data,
  editOwner,
  setOwnerToDelete,
  goOwner,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {cell.column.id === 'actions' && (
                        <div className='py-3 px-6 flex justify-center gap-3'>
                          <Button
                            onClick={() => editOwner(row.original)}
                            className='bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 dark:bg-yellow-500 dark:hover:bg-yellow-300 dark:text-black'
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            onClick={() => setOwnerToDelete(row.original)}
                            className='bg-red-500 hover:bg-red-600 text-white rounded-full p-2 dark:bg-red-600 dark:hover:bg-red-400'
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            onClick={() => goOwner(row.original.id)}
                            className='bg-green-500 hover:bg-green-600 text-white rounded-full p-2 dark:bg-green-600 dark:hover:bg-green-500'
                          >
                            <FaArrowAltCircleRight />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {(table.getCanPreviousPage() || table.getCanNextPage()) && (
        <div className='flex items-center justify-end space-x-2 py-4 px-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
