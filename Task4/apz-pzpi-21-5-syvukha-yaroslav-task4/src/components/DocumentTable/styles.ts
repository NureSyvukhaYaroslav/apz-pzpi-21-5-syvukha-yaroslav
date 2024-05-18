import styled from 'styled-components';

import { getBorder } from '@/utils';

export const IconButton = styled.button<{ colour: string }>`
  all: unset;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.5rem;
  height: 2.5rem;

  background-color: ${({ colour }) => colour};

  ${getBorder()}

  cursor: pointer;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid;
  &:hover {
    background-color: ${(props) => props.theme.colours.foreground.light};
  }
`;

export const Table = styled.tbody`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: center;
  background-color: ${(props) => props.theme.colours.primary};
  color: white;

  &:first-child {
    border-top-left-radius: ${(props) => props.theme.border.radius};
  }

  &:last-child {
    border-top-right-radius: ${(props) => props.theme.border.radius};
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  text-align: left;

  &:last-child {
    display: flex;
    gap: 0.5rem;
  }
`;
