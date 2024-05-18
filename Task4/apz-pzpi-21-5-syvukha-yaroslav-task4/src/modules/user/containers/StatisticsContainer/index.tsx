import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ContainerLoader, ContainerSection } from '@/components';
import { useAxios } from '@/modules/auth';

type Response = {
  filesCount: number;
  categories: unknown;
  amountOfCategories: number;
  oldestFile: Date;
  newestFile: Date;
  filesByDate: Record<string, number>;
};

const StatisticsContainer = () => {
  const axiosAuth = useAxios();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['files'],
    queryFn: () => axiosAuth.get<Response>('/profile/statistics'),
  });

  if (isLoading || isRefetching) {
    return <ContainerLoader />;
  }

  return (
    <ContainerSection>
      <div>{t('your-statistics')}</div>
      <div>
        {t('files')}: {data?.data?.filesCount}
      </div>
      <div>
        {t('categories')}: {data?.data?.amountOfCategories}
      </div>
      <div>
        {t('oldest-file')}:{' '}
        {new Date(data?.data?.oldestFile).toLocaleDateString()}
      </div>
      <div>
        {t('newest-file')}:{' '}
        {new Date(data?.data?.newestFile).toLocaleDateString()}
      </div>
      <div>
        <p>{t('files-by-date')}:</p>
        <ul>
          {Object.entries(data?.data?.filesByDate).map(([date, count]) => (
            <li key={date}>
              {new Date(date).toLocaleDateString()}: {count}
            </li>
          ))}
        </ul>
      </div>
    </ContainerSection>
  );
};

export default StatisticsContainer;
