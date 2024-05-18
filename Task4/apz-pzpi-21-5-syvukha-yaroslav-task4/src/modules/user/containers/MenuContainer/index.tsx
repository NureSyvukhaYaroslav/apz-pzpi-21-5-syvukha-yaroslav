import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Div } from './styles';

import {
  Button,
  ContainerLoader,
  Title,
  MainContainerSection,
} from '@/components';
import { ROUTE } from '@/constants';
import { User } from '@/models';
import { useAxios } from '@/modules/auth';

const ProfileContainer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = (route: ROUTE) => {
    navigate(route);
  };

  const axiosAuth = useAxios();

  const {
    data: profileData,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axiosAuth.get<User>('/profile'),
  });

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <MainContainerSection>
      <Title>{t('profile-menu')}</Title>
      <Div>
        <Button onClick={() => handleNavigate(ROUTE.USER_STATISTICS)}>
          {t('your-statistics')}
        </Button>
        <Button onClick={() => axiosAuth.post('profile/remove-organization')}>
          {t('remove-organization')}
        </Button>

        {!profileData?.data?.organizationId ? (
          <Button onClick={() => handleNavigate(ROUTE.ADD_ORGANIZATION)}>
            {t('add-organization')}
          </Button>
        ) : (
          <>
            <Button onClick={() => handleNavigate(ROUTE.ORGANIZATION)}>
              {t('your-organization')}
            </Button>
            <Button onClick={() => handleNavigate(ROUTE.EDIT_ORGANIZATION)}>
              {t('edit-organization')}
            </Button>
          </>
        )}
      </Div>
    </MainContainerSection>
  );
};

export default ProfileContainer;
