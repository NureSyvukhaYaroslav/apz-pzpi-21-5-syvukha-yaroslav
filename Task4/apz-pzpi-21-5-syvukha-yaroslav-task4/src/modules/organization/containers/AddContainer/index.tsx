import { AddContainerStyled } from './styles';
import AddOrganizationForm from '../../components/AddOrganization';
import RegisterOrganizationForm from '../../components/RegisterOrganization';

const AddContainer = () => {
  return (
    <AddContainerStyled>
      <RegisterOrganizationForm />
      <AddOrganizationForm />
    </AddContainerStyled>
  );
};

export default AddContainer;
