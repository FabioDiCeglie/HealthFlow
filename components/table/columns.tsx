'use client';

import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import AppointmentModal from '../AppointmentModal';
import { StatusBadge } from '../StatusBadge';

export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className='text-14-medium'>{row.index + 1}</p>,
  },
  {
    header: 'Patient',
    accessorKey: 'patient',
    cell: ({ row }) => (
      <p className='text-14-medium'>{row.original.patient.name}</p>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <div className='min-w-[115px]'>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    header: 'Appointment',
    accessorKey: 'schedule',
    cell: ({ row }) => (
      <p className='text-14-regular min-w-[100px]'>
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: 'primaryPhysician',
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );
      if (doctor) {
        return (
          <div className='flex items-center gap-3'>
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={100}
              height={100}
              className='size-8'
            />
            <p className='whitespace nowrap'>{doctor.name}</p>
          </div>
        );
      }
      return <p className='whitespace nowrap'>Any information</p>;
    },
  },
  {
    id: 'actions',
    header: () => <div className='pl-4'>Actions</div>,
    cell: ({ row }) => {
      return (
        <div className='flex gap-1'>
          <AppointmentModal type='schedule' />
          <AppointmentModal type='cancel' />
        </div>
      );
    },
  },
];
