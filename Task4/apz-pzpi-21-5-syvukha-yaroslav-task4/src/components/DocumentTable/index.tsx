import { X, Edit2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton, Table, TableCell, TableHeader, TableRow } from './styles';

import { ROUTE } from '@/constants';
import theme from '@/constants/theme';
import { Document } from '@/models';
import { useAxios } from '@/modules/auth';

const DocumentRow = ({
  file,
  refetch,
}: {
  file: Document;
  refetch: () => void;
}) => {
  const axiosAuth = useAxios();
  const navigate = useNavigate();

  const handleDelete = async () => {
    axiosAuth.delete(`/document/${file.id}`).then(refetch);
  };

  const handleEdit = async () => {
    navigate(`${ROUTE.EDIT_DOCUMENT}/${file.id}`);
  };

  const handleDownload = async (file: Document) => {
    const response = await axiosAuth.get(`/document/${file.id}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${file.id}.${file.type.split('/')[1]}`); // or any other extension
    document.body.appendChild(link);
    link.click();
  };

  return (
    <TableRow>
      <TableCell>{file.id}</TableCell>
      <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{file.userId}</TableCell>
      <TableCell>{file.organizationId}</TableCell>
      <TableCell>{file.documentType}</TableCell>
      <TableCell>
        <IconButton onClick={handleDelete} colour={theme.colours.danger}>
          <X color={theme.font.color.dark} />
        </IconButton>
        <IconButton onClick={handleEdit} colour={theme.colours.warning}>
          <Edit2 color={theme.font.color.dark} />
        </IconButton>
        <IconButton
          onClick={() => handleDownload(file)}
          colour={theme.colours.info}
        >
          <Download color={theme.font.color.dark} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const DocumentTable = ({
  files,
  refetch,
}: {
  files: Document[];
  refetch: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <table>
      <Table>
        <TableRow>
          <TableHeader>{t('id')}</TableHeader>
          <TableHeader>{t('created-at')}</TableHeader>
          <TableHeader>{t('user-id')}</TableHeader>
          <TableHeader>{t('organization-id')}</TableHeader>
          <TableHeader>{t('document-type')}</TableHeader>
          <TableHeader>{t('actions')}</TableHeader>
        </TableRow>
        {files.map((file) => (
          <DocumentRow key={file.id} file={file} refetch={refetch} />
        ))}
      </Table>
    </table>
  );
};

export default DocumentTable;
