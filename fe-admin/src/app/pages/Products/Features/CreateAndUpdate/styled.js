import styled from 'styled-components/macro';
import { InputNumber } from 'antd';
import { SectionWrapper } from 'styles/commons';

export const CustomSectionWrapper = styled(SectionWrapper)`
  padding: 16px;
  padding-bottom: 0;
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 2px;
  }
`;

export const CustomInputNumber = styled(InputNumber)`
  width: 100% !important;
  .ant-input-number-handler-wrap {
    display: none;
  }
`;
