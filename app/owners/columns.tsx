'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { FaBuilding, FaUser } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Owner } from '../types/owner.type';

export const columns: ColumnDef<Owner>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='py-3 px-6 text-left'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Név
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='py-3 px-6 text-left'>
        <span className='text-zinc-900 dark:text-zinc-100'>{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='py-3 px-6 text-left'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Típus
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='py-3 px-6 text-left'>
        <span className='text-zinc-900 dark:text-zinc-100'>
          {row.getValue('type') == 'PERSON' ? <FaUser size={18} /> : <FaBuilding size={18} />}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'items',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='py-3 px-6 text-center'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tárgyak
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='py-3 px-6 text-center'>
        <span className='text-zinc-900 dark:text-zinc-100'>{row.getValue('items')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: () => <div className='py-3 px-6 text-center'>Műveletek</div>,
    cell: ({ row }) => <></>,
  },
];
