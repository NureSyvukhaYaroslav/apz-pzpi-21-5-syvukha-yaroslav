import { useQuery } from '@tanstack/react-query';
import { Home, Menu, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { HeaderStyled } from './styles';
import HeaderLink from '../Link';
import ProfileButton from '../ProfileButton';

import { ROUTE } from '@/constants';
import { User } from '@/models';
import { useAxios } from '@/modules/auth';

const Header = () => {
  const axiosAuth = useAxios();
  const { t } = useTranslation();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axiosAuth.get<User>('/profile'),
  });

  return (
    <HeaderStyled>
      <HeaderLink to={ROUTE.HOME} label={t('home')}>
        <Home />
      </HeaderLink>
      {profileData?.data?.roles.includes('USER') && (
        <HeaderLink to={ROUTE.DOCUMENT} label={t('documents')}>
          <Menu />
        </HeaderLink>
      )}
      {profileData?.data?.roles.includes('ADMIN') && (
        <HeaderLink to={ROUTE.ADMIN} label={t('admin')}>
          <Edit />
        </HeaderLink>
      )}
      <ProfileButton />
    </HeaderStyled>
  );
};

export default Header;
