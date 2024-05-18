import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { UploadLinkButton } from './styles';

import { DocumentTable, Title } from '@/components';
import { ContainerLoader } from '@/components';
import { MainContainerSection } from '@/components/Container';
import { ROUTE } from '@/constants';
import { Document } from '@/models';
import { useAxios } from '@/modules/auth';

const DocumentContainer = () => {
  const axiosAuth = useAxios();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: () => axiosAuth.get<Document[]>('/document'),
  });

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <MainContainerSection>
      <Title>{t('your-documents')}</Title>
      <UploadLinkButton onClick={() => navigate(ROUTE.ADD_DOCUMENT)}>
        {t('upload-document')}
      </UploadLinkButton>
      <DocumentTable files={data.data} refetch={refetch} />
    </MainContainerSection>
  );
};

export default DocumentContainer;
