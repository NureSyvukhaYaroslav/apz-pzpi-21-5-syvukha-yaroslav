import { yupResolver } from '@hookform/resolvers/yup';
import { AES } from 'crypto-js';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { object, ObjectSchema, string } from 'yup';

import { Form, FormDiv } from './styles';

import {
  Button,
  Card,
  FormInput,
  FormInputPassword,
  Title,
} from '@/components';
import { AES_KEY } from '@/constants';
import { useAxios } from '@/modules/auth';

type FormData = {
  name: string;
  password: string;
};

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

const RegisterOrganizationForm = () => {
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

  const onFormSubmit = async (data: FormData) => {
    const ciphertext = AES.encrypt(JSON.stringify(data), AES_KEY).toString();

    try {
      await toast.promise(
        axiosAuth.post('organization', { data: ciphertext }),
        {
          pending: 'Registering new organization...',
          success: 'Organization registered successfully',
          error: 'Failed to register organization',
        },
      );

      reset();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Card>
      <Title>Register Organization</Title>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <FormDiv>
          <FormInput label={'name'} register={register} errors={errors} />

          <FormInputPassword
            label={'password'}
            register={register}
            errors={errors}
          />

          <Button type="submit">Submit</Button>
        </FormDiv>
      </Form>
    </Card>
  );
};

export default RegisterOrganizationForm;
