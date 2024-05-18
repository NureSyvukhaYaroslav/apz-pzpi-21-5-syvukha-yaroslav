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

type FormData = { name: string };

const schema: ObjectSchema<FormData> = object({
  name: string(),
});

const AdminEditOrganization = () => {
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

  const onFormSubmit = async (values: FormData) => {
    try {
      await toast.promise(
        axiosAuth.post(
          `organization-admin/update`,
          removeEmpty({ ...values, id: params['id'] }),
        ),
        {
          pending: 'Updating organization...',
          success: 'Updated organization successfully',
          error: 'Failed to update organization',
        },
      );

      reset();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Card className="m-24">
      <Title className="text-center">Edit Organization {params['id']}</Title>
      <form
        className="flex flex-row p-12"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="flex w-full flex-col gap-4">
          <FormInput label={'name'} register={register} errors={errors} />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Card>
  );
};

export default AdminEditOrganization;
