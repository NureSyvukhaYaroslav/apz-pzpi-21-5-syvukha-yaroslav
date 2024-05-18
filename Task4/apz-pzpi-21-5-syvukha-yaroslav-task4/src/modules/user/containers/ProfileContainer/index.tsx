import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { AES } from 'crypto-js';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ObjectSchema, object, string, ref } from 'yup';

import { Form, FormDiv } from './styles';

import {
  Button,
  ErrorMessage,
  FormInput,
  FormInputPassword,
  MainContainerSection,
  Title,
} from '@/components';
import { ContainerLoader } from '@/components';
import { AES_KEY, PasswordRegex } from '@/constants';
import { User } from '@/models';
import { useAxios } from '@/modules/auth';
import { SignUpFormValues, UpdateProfileFormValues } from '@/types';
import { removeEmpty } from '@/utils';

const schema: ObjectSchema<UpdateProfileFormValues> = object({
  email: string().email('Input is invalid email').notRequired(),
  nickname: string()
    .trim()
    .matches(/.{4,32}/, {
      excludeEmptyString: true,
      message: 'Must be between 4 and 32 characters long',
    }),
  password: string()
    .trim()
    .matches(/.{8,32}/, {
      excludeEmptyString: true,
      message: 'Must be between 8 and 32 characters long',
    })
    .matches(PasswordRegex, {
      excludeEmptyString: true,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  passwordConfirmation: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .notRequired(),
});

const ProfileContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver<UpdateProfileFormValues>(schema),
    mode: 'onChange',
  });

  const axiosAuth = useAxios();
  const { t } = useTranslation();

  const {
    data: profileData,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axiosAuth.get<User>('/profile'),
  });

  const password = watch('password');

  useEffect(() => {
    if (touchedFields.password) {
      trigger('passwordConfirmation');
    }
  }, [password, trigger, touchedFields.password]);

  const onFormSubmit = async (data: SignUpFormValues) => {
    const ciphertext = AES.encrypt(
      JSON.stringify(removeEmpty(data)),
      AES_KEY,
    ).toString();

    try {
      await toast.promise(
        axiosAuth.patch<User>('profile', { data: ciphertext }),
        {
          pending: 'Updating profile...',
          success: 'Successfully updated profile',
          error: 'Failed to update profile',
        },
      );

      reset();
      refetch();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <MainContainerSection>
      <Title>{t('your-profile')}</Title>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        {/* <div>image</div> */}
        <FormDiv>
          <ErrorMessage message={error?.message} />

          <FormInput
            placeholder={profileData?.data?.email}
            label={'email'}
            register={register}
            errors={errors}
          />

          <FormInput
            placeholder={profileData?.data?.nickname}
            label={'nickname'}
            register={register}
            errors={errors}
          />

          <FormInputPassword
            label={'password'}
            register={register}
            errors={errors}
          />

          <FormInputPassword
            label={'passwordConfirmation'}
            register={register}
            errors={errors}
          />

          <Button type="submit">Submit</Button>
        </FormDiv>
      </Form>
    </MainContainerSection>
  );
};

export default ProfileContainer;
