import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ContainerLoader } from '@/components';
import UserTable from '@/components/UserTable';
import { User } from '@/models';
import { useAxios } from '@/modules/auth';

const UserContainer = () => {
  const axiosAuth = useAxios();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: () => axiosAuth.get<User[]>('/user'),
  });

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <h1 className="text-center text-2xl">{t('users')}</h1>
      <UserTable users={data.data} refetch={refetch} />
    </div>
  );
};

export default UserContainer;
