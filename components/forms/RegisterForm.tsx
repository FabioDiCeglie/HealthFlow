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
import { GenderOptions } from '@/constants';
import { Label } from '@/components/ui/label';

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
        </section>

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
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
