'use client';

import SubmitButton from '@/components/SubmitButton';
import { Form, FormControl } from '@/components/ui/form';
import { userFormValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from './CustomFormField';
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Doctors, GenderOptions } from '@/constants';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import Image from 'next/image';

export const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async ({
    name,
    email,
    phone,
  }: z.infer<typeof userFormValidation>) => {
    setIsLoading(true);

    // try {
    //   const userData = { name, email, phone };

    //   const newUser = await createUser(userData);

    //   if (newUser) {
    //     router.push(`/patients/${newUser.id}/register`);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>Let us know more about yourself. </p>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal information </h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='name'
            label='Full name'
            placeholder='John Doe'
            iconSrc='/assets/icons/user.svg'
            iconAlt='user icon'
          />

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              label='Email'
              placeholder='johndow@gmail.com'
              iconSrc='/assets/icons/email.svg'
              iconAlt='email icon'
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='phone'
              label='Phone number'
              placeholder='(555) 123-4567'
            />
          </div>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='birthDate'
              label='Date of Birth'
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='gender'
              label='Gender'
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className='flex h-11 gap-6 xl:justify-between'
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className='radio-group'>
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className='cursor-pointer'>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='address'
              label='Address'
              placeholder='14th Street, New York'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='occupation'
              label='Occupation'
              placeholder='Software Engineer'
            />
          </div>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='emergencyContactName'
              label='Emergency Contact Name'
              placeholder="Guardian's name"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='emergencyContactNumber'
              label='Emergency Contact Number'
              placeholder='(555) 123-4567'
            />
          </div>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Medical information </h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name='primaryPhysician'
            label='Primary Physician'
            placeholder='Select a physician'
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

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='insuranceProvider'
              label='Insurance provider'
              placeholder='BlueCross'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='insurancePolicyNumber'
              label='Insurance policy number'
              placeholder='ABC123456789'
            />
          </div>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name='allergies'
              label='Allergies (if any)'
              placeholder='Peanuts, Penicillin, Pollen'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name='currentMedication'
              label='Current medication (if any)'
              placeholder='Ibrupofen (200mg)'
            />
          </div>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name='familyMedicalHistory'
              label=' Family medical history (if relevant)'
              placeholder='Mother had brain cancer, Father has hypertension'
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name='pastMedicalHistory'
              label='Past medical history'
              placeholder='Appendectomy in 2015, Asthma diagnosis in childhood'
            />
          </div>
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
