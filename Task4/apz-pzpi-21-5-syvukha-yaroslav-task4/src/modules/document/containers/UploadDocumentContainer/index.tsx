import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mixed, object, ObjectSchema, string } from 'yup';

import {
  Button,
  CardForm,
  ErrorMessage,
  FormInput,
  StateSuspense,
  Title,
} from '@/components';
import { ContainerDiv, MainContainerSection } from '@/components/Container';
import { ResponseStatusCode, ROUTE } from '@/constants';
import { useLoading } from '@/hooks';
import { useAuth, useAxios } from '@/modules/auth';

type FormValues = { documentType: string; file: FileList };

const schema: ObjectSchema<FormValues> = object({
  documentType: string().required('Type is required'),
  file: mixed<FileList>()
    .test('fileSize', 'The file is too large', (value) => {
      if (value.length === 0) {
        return true;
      }

      return value[0].size <= 1024 * 1024 * 5;
    })
    .test('fileType', 'Invalid file type', (value) => {
      if (value.length === 0) {
        return true;
      }

      return ['pdf', 'jpeg', 'png'].includes(value[0].type.split('/')[1]);
    })
    .required('File is required'),
});

const UploadDocumentContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver<FormValues>(schema),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const axiosAuth = useAxios();

  const { loading, error, startLoading, stopLoading, errorOccurred } =
    useLoading();

  const onFormSubmit = async (values: FormValues) => {
    try {
      startLoading();

      const data = new FormData();
      data.append('file', values.file[0]);
      data.append('documentType', values.documentType);

      await axiosAuth.post('/document/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      stopLoading();
      navigate(ROUTE.DOCUMENT);
    } catch {
      errorOccurred(new Error('Some unexpected error occurred'));
    }
  };

  return (
    <MainContainerSection>
      <ContainerDiv>
        <CardForm onSubmit={handleSubmit(onFormSubmit)}>
          <Title>Sign Up</Title>

          <ErrorMessage message={error?.message} />

          <FormInput
            label={'documentType'}
            register={register}
            errors={errors}
          />

          <Controller
            name="file"
            control={control}
            render={({ field: { ref, onChange, onBlur, name } }) => (
              <input
                type="file"
                ref={ref}
                onChange={(e) => {
                  onChange(e.target.files);
                }}
                onBlur={onBlur}
                name={name}
              />
            )}
          />

          <StateSuspense show={!loading} fallback={<div>Loading</div>} />

          <Button type="submit">Submit</Button>
        </CardForm>
      </ContainerDiv>
    </MainContainerSection>
  );
};

export default UploadDocumentContainer;
