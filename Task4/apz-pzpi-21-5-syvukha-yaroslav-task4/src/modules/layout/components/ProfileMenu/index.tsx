import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MenuButton, MenuLink, MenuText, ProfileMenuStyled } from './styles';
import LayoutContext, { DialogType } from '../../contexts/LayoutProvider';

import { ROUTE } from '@/constants';
import { useAuth } from '@/modules/auth';

const ProfileMenu = ({ onClose }: { onClose: () => void }) => {
  const { openDialog } = useContext(LayoutContext);
  const { logOut, authorized } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleLinkClick = (type: DialogType) => {
    openDialog(true, type);
  };

  const handleLogOut = () => {
    logOut();
    navigate(ROUTE.HOME);
  };

  const handleLangChange = (str: string) => {
    localStorage.setItem('i18nextLng', str);
  };

  return (
    <ProfileMenuStyled
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {authorized() ? (
        <>
          <MenuLink to={ROUTE.USER}>{t('profile')}</MenuLink>
          <MenuText onClick={handleLogOut}>{t('logout')}</MenuText>
        </>
      ) : (
        <>
          <MenuButton onClick={() => handleLinkClick('signIn')}>
            {t('sign-in')}
          </MenuButton>
          <MenuButton onClick={() => handleLinkClick('signUp')}>
            {t('sign-up')}
          </MenuButton>
        </>
      )}
      <MenuText onClick={() => handleLangChange('en')}>Eng</MenuText>
      <MenuText onClick={() => handleLangChange('ua')}>Укр</MenuText>
    </ProfileMenuStyled>
  );
};

export default ProfileMenu;
