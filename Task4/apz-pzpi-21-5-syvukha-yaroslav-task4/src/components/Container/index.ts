import styled from 'styled-components';

const BaseContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100%;
  width: 100%;
`;

const MainContainer = styled(BaseContainer)`
  padding: 2rem 6rem;

  justify-content: start;
`;

export const ContainerDiv = styled(BaseContainer)``;

export const ContainerSection = styled(BaseContainer).attrs({
  as: 'section',
})``;

export const MainContainerDiv = styled(MainContainer)``;

export const MainContainerSection = styled(MainContainer).attrs({
  as: 'section',
})``;
