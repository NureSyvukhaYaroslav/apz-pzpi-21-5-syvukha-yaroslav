import { X, Edit2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton, Table, TableCell, TableHeader, TableRow } from './styles';

import { ROUTE } from '@/constants';
import theme from '@/constants/theme';
import { Organization } from '@/models';
import { useAxios } from '@/modules/auth';

const OrganizationRow = ({
  org,
  refetch,
}: {
  org: Organization;
  refetch: () => void;
}) => {
  const axiosAuth = useAxios();
  const navigate = useNavigate();

  const handleDelete = async () => {
    axiosAuth.delete(`/organization-admin/${org.id}`).then(refetch);
  };

  const handleEdit = async () => {
    navigate(`${ROUTE.ADMIN_ORGANIZATIONS_EDIT}/${org.id}`);
  };

  return (
    <TableRow>
      <TableCell>{org.id}</TableCell>
      <TableCell>{org.name}</TableCell>
      <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <IconButton onClick={handleDelete} colour={theme.colours.danger}>
          <X color={theme.font.color.dark} />
        </IconButton>
        <IconButton onClick={handleEdit} colour={theme.colours.warning}>
          <Edit2 color={theme.font.color.dark} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const OrganizationTable = ({
  orgs,
  refetch,
}: {
  orgs: Organization[];
  refetch: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <table>
      <Table>
        <TableRow>
          <TableHeader>{t('id')}</TableHeader>
          <TableHeader>{t('name')}</TableHeader>
          <TableHeader>{t('created-at')}</TableHeader>
          <TableHeader>{t('actions')}</TableHeader>
        </TableRow>
        {orgs.map((org) => (
          <OrganizationRow key={org.id} org={org} refetch={refetch} />
        ))}
      </Table>
    </table>
  );
};

export default OrganizationTable;
