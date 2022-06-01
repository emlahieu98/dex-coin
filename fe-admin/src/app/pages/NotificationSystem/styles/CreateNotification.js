import { Col } from 'antd';
import { Avatar } from 'app/components';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';

export const CustomSectionWrapper = styled(SectionWrapper)`
  padding: 0;
`;
export const CustomColLeft = styled(Col)`
  border-right: 1px solid #ebebf0;
  padding: 0 0 0 12px !important;
  .title-propose {
    /* display: flex; */
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    font-weight: 500;
    border-bottom: 1px solid #ebebf0;
    .anticon {
      margin: 0 8px 0 20px;
      font-size: 28px;
      vertical-align: -1px;
    }
  }
  .list-propose {
    padding: 12px 0;
    &:hover {
      cursor: pointer;
    }
    .item-propose {
      display: flex;
      line-height: 45px;
      height: 45px;
      .anticon {
        font-size: 20px;
        margin-left: 20px;
        vertical-align: 1px;
      }
      .icon {
        margin-top: 1px;
      }
      .name {
        font-size: 14px;
        font-weight: 500;
        margin-left: 38px;
      }
    }
    .selected {
      color: #4869de;
      font-size: 16px;
      background-color: #e6f6ff;
      .icon {
        margin-left: -4px;
      }
      .anticon {
        font-size: 22px;
      }
      /* .name {
        font-size: 16px;
        font-weight: 600;
      } */
      &::before {
        content: '';
        width: 4px;
        height: 45px;
        background: #3d56a6;
        border-radius: 0px 6px 6px 0px;
      }
    }
  }
  .btn-action {
    margin: 12px 24px;
  }
`;
export const CustomColRight = styled(Col)`
  padding: 0 !important;
  .title {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    font-weight: 500;
    border-bottom: 1px solid #ebebf0;
    text-align: center;
  }
  .form {
    margin-top: 20px;
    .ant-form-item-label {
      margin-right: 70px;
    }
  }
  .bottom-action {
    border-top: 1px solid #ebebf0;
    padding: 12px 24px 24px 0;
  }
`;

export const Action = styled.div`
  text-align: end;
`;

export const HeaderModal = styled.div`
  text-align: center;
  margin-top: 20px;
  .modal-img {
    width: 80px;
    display: flex;
    margin: auto;
  }
  .modal-title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .modal-desc {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
`;

export const ContentModal = styled.div`
  /* min-height: 10px; */
  margin: 48px 0 36px;
  .item {
    display: flex;
    .label {
      font-weight: bold;
      font-size: 14px;
      line-height: 24px;
      margin-right: 12px;
    }
    &:first-child {
      margin-bottom: 24px;
      .label {
        margin-right: 72px;
      }
    }
    &:last-child {
      .label {
        &::after {
          display: inline-block;
          margin-left: 4px;
          color: #ff4d4f;
          font-size: 18px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: '*';
        }
      }
    }
  }
  .chose-time {
  }
`;

export const CustomDivUser = styled.div`
  display: flex;
  .user-info {
    margin: auto 12px;
  }
  .user-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .user-desc {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
`;

export const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
  font-size: 22px;
`;
