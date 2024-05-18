import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ContainerLoader } from '@/components';
import OrganizationTable from '@/components/OrganizationTable';
import UserTable from '@/components/UserTable';
import { ROUTE } from '@/constants';
import { Organization, User } from '@/models';
import { useAxios } from '@/modules/auth';

const AdminOrganizationContainer = () => {
  const axiosAuth = useAxios();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => axiosAuth.get<Organization[]>('/organization-admin'),
  });

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <h1 className="text-center text-2xl">{t('organizations')}</h1>
      <Button onClick={() => navigate(ROUTE.ADMIN_ORGANIZATIONS_ADD)}>
        {t('add-organization')}
      </Button>
      <OrganizationTable orgs={data.data} refetch={refetch} />
    </div>
  );
};

export default AdminOrganizationContainer;
