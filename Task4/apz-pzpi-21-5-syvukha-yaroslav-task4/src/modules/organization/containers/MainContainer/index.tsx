import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { DocumentTable, Title } from '@/components';
import { ContainerLoader } from '@/components';
import { MainContainerSection } from '@/components/Container';
import { Organization } from '@/models';
import { Document } from '@/models';
import { useAxios } from '@/modules/auth';

const MainContainer = () => {
  const axiosAuth = useAxios();
  const { t } = useTranslation();

  const {
    data: organizationData,
    isLoading: isLoadingOrg,
    isRefetching: isRefetchingOrg,
  } = useQuery({
    queryKey: ['organization'],
    queryFn: () =>
      axiosAuth.get<Organization>('/organization/user-organization'),
  });

  const {
    data: filesData,
    isLoading: isLoadingFil,
    isRefetching: isRefetchingFil,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ['files', organizationData?.data?.id],
    queryFn: () =>
      axiosAuth.post<Document[]>('/document/search/type', {
        organizationId: organizationData?.data?.id,
      }),
  });

  if (isLoadingOrg || isRefetchingOrg || isLoadingFil || isRefetchingFil) {
    return <ContainerLoader />;
  }

  return (
    <MainContainerSection>
      <Title>{t('your-documents')}</Title>
      <div>
        {t('organization-id')}: {organizationData?.data?.id}
      </div>
      <DocumentTable files={filesData.data} refetch={refetchFiles} />
    </MainContainerSection>
  );
};

export default MainContainer;
