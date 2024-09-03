'use client';

import SubmitButton from '@/components/SubmitButton';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { Doctors } from '@/constants';
import { createUser } from '@/lib/actions/patient.actions';
import { getAppointmentSchema, UserFormValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from './CustomFormField';
import { FormFieldType } from './PatientForm';
import { createAppointment } from '@/lib/actions/appointment.actions';

export const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  let buttonLabel;
  let status: Status;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel appointment';
      status = 'cancelled';
      break;
    case 'create':
      buttonLabel = 'Create appointment';
      status = 'pending'
      break;
    case 'schedule':
      buttonLabel = 'Schedule appointment';
      status = 'scheduled';
      break;
    default:
      status = 'pending';
      break;
  }

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(Date.now()),
      reason: '',
      note: '',
      cancellationReason: '',
    },
  });

  const onSubmit = async ({
    primaryPhysician,
    schedule,
    reason,
    note,
    cancellationReason,
  }: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician,
          schedule: new Date(schedule),
          reason: reason || '',
          note,
          status,
        };

        const appointment = await createAppointment(appointmentData);

        if(appointment){
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        <section className='mb-12 space-y-4'>
          <h1 className='header'>New Appointment 👨‍⚕️</h1>
          <p className='text-dark-700'>
            Request a new appointment in 10 seconds
          </p>
        </section>

        {type !== 'cancel' ? (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='primaryPhysician'
              label='Doctor'
              placeholder='Select a doctor'
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className='flex cursor-pointer items-center gap-2 '>
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className='rounded-full border border-dark-500'
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label='Expected appointment date'
              showTimeSelect
              dateFormat='MM/dd/yyyy - h:mm aa'
            />

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='reason'
                label='Reason for appointment'
                placeholder='Enter a reason for appointment'
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='note'
                label='Notes'
                placeholder='Enter notes'
              />
            </div>
          </>
        ) : (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='cancellationReason'
            label='Reason for cancellation'
            placeholder='Enter a reason for cancellation'
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
