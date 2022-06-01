import styled from 'styled-components';
import { styledSystem } from './theme/utils';

export const CustomH1 = styledSystem(
  styled.h1`
    font-weight: 700;
  `,
);
export const CustomH2 = styledSystem(
  styled.h2`
    font-weight: 700;
  `,
);
export const CustomH3 = styledSystem(
  styled.h3`
    font-weight: 700;
  `,
);
export const CustomH4 = styledSystem(
  styled.h4`
    font-weight: 700;
  `,
);
export const SectionWrapper = styledSystem(
  styled.div`
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 1.1rem;
    padding: 1.5rem;
    /* border: 1px solid #ffffff; */
    border: 1px solid #e6e6e9;
  `,
);
export const CustomStyle = styledSystem(styled.div``);

export const CustomTitle = styledSystem(styled.div``);
CustomTitle.defaultProps = {
  fontWeight: 'black',
  fontSize: 'f6',
  mb: { xs: 's5' },
};
