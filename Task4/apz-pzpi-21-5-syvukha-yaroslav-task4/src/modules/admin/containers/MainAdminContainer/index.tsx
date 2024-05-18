import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { ROUTE } from '@/constants';
const MainAdminContainer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLinkClick = (route: ROUTE) => {
    navigate(route);
  };

  return (
    <div>
      <h1 className="text-center text-2xl">{t('admin')}</h1>
      <div className="flex flex-row justify-evenly">
        <Button onClick={() => handleLinkClick(ROUTE.ADMIN_USERS)}>
          {t('user')}
        </Button>
        <Button onClick={() => handleLinkClick(ROUTE.ADMIN_ORGANIZATIONS)}>
          {t('organization')}
        </Button>
        <Button onClick={() => handleLinkClick(ROUTE.ADMIN_DOCUMENTS)}>
          {t('document')}
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default MainAdminContainer;
