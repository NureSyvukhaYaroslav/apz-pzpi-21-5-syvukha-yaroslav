import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, ObjectSchema, string } from 'yup';

import {
  Button,
  CardForm,
  ContainerLoader,
  ErrorMessage,
  FormInput,
  Title,
} from '@/components';
import { ContainerDiv, MainContainerSection } from '@/components/Container';
import { ROUTE } from '@/constants';
import { Document } from '@/models';
import { useAxios } from '@/modules/auth';

type FormValues = { documentType: string };

const schema: ObjectSchema<FormValues> = object({
  documentType: string().required('Type is required'),
});

const EditDocumentContainer = () => {
  const navigate = useNavigate();
  const axiosAuth = useAxios();

  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<FormValues>(schema),
    mode: 'onChange',
  });

  const {
    data: fileData,
    error,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [params.id, 'profile'],
    queryFn: () =>
      axiosAuth.post<Document>('/document/search/id', { id: params.id }),
  });

  console.log(fileData);

  const onFormSubmit = async (values: FormValues) => {
    await toast
      .promise(
        axiosAuth.post<Document[]>(`document/update/${params.id}`, {
          ...values,
        }),
        {
          pending: 'Updating profile...',
          success: 'Successfully updated profile',
          error: 'Failed to update profile',
        },
      )
      .then(() => navigate(ROUTE.DOCUMENT));
  };

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <MainContainerSection>
      <ContainerDiv>
        <CardForm onSubmit={handleSubmit(onFormSubmit)}>
          <Title>Sign Up</Title>

          <ErrorMessage message={error?.message} />

          <FormInput
            label={'documentType'}
            register={register}
            placeholder={fileData?.data[0]?.documentType}
            errors={errors}
          />

          <Button type="submit">Submit</Button>
        </CardForm>
      </ContainerDiv>
    </MainContainerSection>
  );
};

export default EditDocumentContainer;
