import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ObjectSchema, object, string } from 'yup';

import { Form, FormDiv } from './styles';

import {
  Button,
  ErrorMessage,
  FormInput,
  FormInputPassword,
  Title,
} from '@/components';
import { ContainerLoader } from '@/components';
import { MainContainerSection } from '@/components/Container';
import { Organization } from '@/models';
import { useAxios } from '@/modules/auth';
import { removeEmpty } from '@/utils';

type FormData = { name: string; password: string };

const schema: ObjectSchema<FormData> = object({
  name: string()
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
    }),
});

const EditContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver<FormData>(schema),
    mode: 'onChange',
  });

  const axiosAuth = useAxios();

  const {
    data: organizationData,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['profile-edit-organization'],
    queryFn: () =>
      axiosAuth.get<Organization>('/organization/user-organization'),
  });

  const onFormSubmit = async (data: FormData) => {
    try {
      await toast.promise(
        axiosAuth.post(
          '/organization/update',
          removeEmpty({ ...data, id: organizationData?.data?.id }),
        ),
        {
          pending: 'Updating organization...',
          success: 'Successfully updated organization',
          error: 'Failed to update organization',
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
      <Title>Your Organization</Title>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <FormDiv>
          <ErrorMessage message={error?.message} />

          <FormInput
            placeholder={organizationData?.data?.name}
            label={'name'}
            register={register}
            errors={errors}
          />

          <FormInputPassword
            label={'password'}
            register={register}
            errors={errors}
          />

          <Button type="submit">Submit</Button>
        </FormDiv>
      </Form>
    </MainContainerSection>
  );
};

export default EditContainer;
