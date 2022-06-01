/**
 *
 * Input
 *
 */
import React, { memo } from 'react';
import { Input as I } from 'antd';
import styled from 'styled-components/macro';
import { withFormContext } from '../Form/withFormContext';

const CustomInput = styled(I)`
  border-radius: 4px;
  border-color: ${({ theme }) => theme.stroke};
  /* height: 40px; */
`;
const Input = withFormContext(
  memo(props => {
    return <CustomInput {...props} />;
  }),
);
Object.assign(Input, I);
Input.Password = withFormContext(Input.Password);
export default Input;
