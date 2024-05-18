import { useTranslation } from 'react-i18next';

const Page = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('home-page')}</p>
    </div>
  );
};

export default Page;
