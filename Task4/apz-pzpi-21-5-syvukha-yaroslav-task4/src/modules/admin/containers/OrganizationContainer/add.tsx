import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { object, ObjectSchema, string } from 'yup';

import { Button, Card, FormInput, Title } from '@/components';
import { useAxios } from '@/modules/auth';
import { removeEmpty } from '@/utils';

type FormData = { password: string; name: string };

const schema: ObjectSchema<FormData> = object({
  name: string(),
  password: string(),
});

const AdminAddOrganization = () => {
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

  const onFormSubmit = async (values: FormData) => {
    try {
      await toast.promise(
        axiosAuth.post(`organization-admin/create`, removeEmpty(values)),
        {
          pending: 'Adding organization...',
          success: 'Added organization successfully',
          error: 'Failed to add organization',
        },
      );

      reset();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Card className="m-24">
      <Title className="text-center">Add Organization</Title>
      <form
        className="flex flex-row p-12"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="flex w-full flex-col gap-4">
          <FormInput label={'name'} register={register} errors={errors} />
          <FormInput label={'password'} register={register} errors={errors} />

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Card>
  );
};

export default AdminAddOrganization;
