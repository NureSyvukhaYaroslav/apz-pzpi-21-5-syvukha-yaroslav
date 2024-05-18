import { yupResolver } from '@hookform/resolvers/yup';
import { AES } from 'crypto-js';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, ObjectSchema, string } from 'yup';

import { Button, Card, FormInput, Title } from '@/components';
import { AES_KEY } from '@/constants';
import { useAxios } from '@/modules/auth';
import { removeEmpty } from '@/utils';

type FormData = {
  email: string;
  nickname: string;
  organizationId: string;
};

const schema: ObjectSchema<FormData> = object({
  email: string().email(),
  nickname: string(),
  organizationId: string(),
});

const AdminEditUser = () => {
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

  const params = useParams();

  const onFormSubmit = async (data: FormData) => {
    const ciphertext = AES.encrypt(
      JSON.stringify(removeEmpty(data)),
      AES_KEY,
    ).toString();

    try {
      await toast.promise(
        axiosAuth.post(`user/${params['id']}`, { data: ciphertext }),
        {
          pending: 'Updating user...',
          success: 'Updated user successfully',
          error: 'Failed to update user',
        },
      );

      reset();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Card className="m-24">
      <Title className="text-center">Edit User ${params['id']}</Title>
      <form
        className="flex flex-row p-12"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="flex w-full flex-col gap-4">
          <FormInput label={'email'} register={register} errors={errors} />
          <FormInput label={'nickname'} register={register} errors={errors} />
          <FormInput
            label={'organizationId'}
            register={register}
            errors={errors}
          />

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Card>
  );
};

export default AdminEditUser;
