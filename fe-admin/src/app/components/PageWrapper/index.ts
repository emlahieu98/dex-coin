import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export const PageWrapper = styled.div`
  max-width: ${({ fixWidth }: any) =>
    fixWidth ? `${StyleConstants.bodyWidth}px` : '1600px'};
  margin: 1.5rem auto 2.5rem;
  /* background-color: ${p => p.theme.background}; */
  padding: 0 1.5rem;
  box-sizing: content-box;
`;

export default PageWrapper;
