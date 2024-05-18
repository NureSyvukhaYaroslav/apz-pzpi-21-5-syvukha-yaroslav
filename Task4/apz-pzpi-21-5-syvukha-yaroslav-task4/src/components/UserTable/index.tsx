import { X, Edit2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton, Table, TableCell, TableHeader, TableRow } from './styles';

import { ROUTE } from '@/constants';
import theme from '@/constants/theme';
import { User } from '@/models';
import { useAxios } from '@/modules/auth';

const UserRow = ({ user, refetch }: { user: User; refetch: () => void }) => {
  const axiosAuth = useAxios();
  const navigate = useNavigate();

  const handleDelete = async () => {
    axiosAuth.delete(`/user/${user.id}`).then(refetch);
  };

  const handleEdit = async () => {
    navigate(`${ROUTE.ADMIN_USERS_EDIT}/${user.id}`);
  };

  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.nickname}</TableCell>
      <TableCell>{user.organizationId}</TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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

const UserTable = ({
  users,
  refetch,
}: {
  users: User[];
  refetch: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <table>
      <Table>
        <TableRow>
          <TableHeader>{t('id')}</TableHeader>
          <TableHeader>{t('email')}</TableHeader>
          <TableHeader>{t('nickname')}</TableHeader>
          <TableHeader>{t('organization-id')}</TableHeader>
          <TableHeader>{t('created-at')}</TableHeader>
          <TableHeader>{t('actions')}</TableHeader>
        </TableRow>
        {users.map((user) => (
          <UserRow key={user.id} user={user} refetch={refetch} />
        ))}
      </Table>
    </table>
  );
};

export default UserTable;
