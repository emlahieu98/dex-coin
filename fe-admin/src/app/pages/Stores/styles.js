import styled from 'styled-components/macro';
import { Dropdown, Menu, Modal as AntdModal } from 'antd';
const { Item: MenuItem } = Menu;

export const Wrapper = styled.div`
  padding-top: ${({ theme }) => theme.space.s4 * 2.5}px;
`;

export const Header = {
  Wrapper: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.space.s4 * 2}px;
  `,
  Title: styled.div`
    font-size: ${({ theme }) => theme.fontSizes.f6}px;
    font-weight: 700;
  `,
  Button: styled.div``,
};

export const Body = styled.div``;

export const List = styled.div``;

export const Item = {
  Wrapper: styled.div`
    padding: ${({ theme }) => theme.space.s4 * 1.5}px
      ${({ theme }) => theme.space.s4 * 2}px;
    background-color: ${({ theme }) => theme.whitePrimary};
    border: solid 1px ${({ theme }) => theme.stroke};
    border-radius: ${({ theme }) => theme.radius * 1.5}px;
    display: flex;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.space.s4 * 2}px;
    height: ${({ theme }) => 45 + theme.space.s4 * 3}px;
  `,
  Thumb: styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.stroke};
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    i {
      color: ${({ theme }) => theme.gray3};
      font-size: ${({ theme }) => theme.fontSizes.f3}px;
    }
  `,
  Info: {
    Wrapper: styled.div`
      flex: 1;
    `,
    Title: styled.div`
      font-weight: 600;
      margin-bottom: ${({ theme }) => theme.space.s0}px;
    `,
    Email: styled.div`
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
      color: ${({ theme }) => theme.grayBlue};
    `,
  },
  Status: styled.div`
    color: ${props => (props.active ? '#50BF4E' : '#EB5757')};
    padding: 0 30px;
    border-right: solid 1px ${({ theme }) => theme.stroke};
    line-height: 45px;

    &:before {
      content: '';
      display: inline-block;
      width: ${({ theme }) => theme.space.s4 / 2}px;
      height: ${({ theme }) => theme.space.s4 / 2}px;
      background-color: ${props => (props.active ? '#50BF4E' : '#EB5757')};
      border-radius: 50%;
      margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      vertical-align: middle;
    }
  `,
  Platform: styled.div`
    padding: 5px 30px;
    border-right: solid 1px ${({ theme }) => theme.stroke};
    text-transform: capitalize;
    height: 100%;

    span {
      display: block;
      width: 93px;
      padding: ${({ theme }) => theme.space.s4 / 2}px 0;
      border: solid 1px ${({ theme }) => theme.stroke};
      border-radius: ${({ theme }) => theme.radius}px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
      text-align: center;

      img {
        max-width: 14px;
        max-height: 14px;
        vertical-align: middle;
        margin-top: -1px;
        margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      }
    }
  `,
  Detail: {
    Wrapper: styled.div`
      display: flex;
      padding: 0 30px;
    `,
    Item: {
      Wrapper: styled.div`
        &:first-child {
          margin-right: 30px;
        }
      `,
      Title: styled.div`
        font-size: ${({ theme }) => theme.fontSizes.f1}px;
        color: ${({ theme }) => theme.grayBlue};
        margin-bottom: ${({ theme }) => theme.space.s4 / 1.5}px;
      `,
      Number: styled.div`
        font-weight: 700;
        color: ${({ theme }) => theme.primary};
      `,
    },
  },
  Action: {
    Wrapper: styled.div``,
    Dropdown: styled(Dropdown)`
      cursor: pointer;
    `,
    Menu: styled(Menu)`
      border-radius: ${({ theme }) => theme.radius}px;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    `,
    MenuItem: styled(MenuItem)`
      color: ${({ theme }) => theme.primary};
      &:last-child {
        color: ${({ theme }) => theme.redPrimary};
      }

      i {
        width: ${({ theme }) => theme.space.s4 * 2}px;
        height: ${({ theme }) => theme.space.s4 * 2}px;
        line-height: ${({ theme }) => theme.space.s4 * 2}px;
        text-align: center;
        margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      }
    `,
  },
};

export const Modal = {
  Wrapper: styled(AntdModal)`
    text-align: center;
  `,
  Title: styled.div`
    font-size: 30px;
    color: ${({ theme }) => theme.primary};
    font-weight: 700;
  `,
  Desc: styled.div`
    color: ${({ theme }) => theme.gray1};
    margin-bottom: ${({ theme }) => theme.space.s4 * 1.5}px;
  `,
  PlatForm: {
    List: styled.div`
      display: flex;
      justify-content: center;
    `,
    Item: styled.div`
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 35px;
      }
    `,
    Icon: styled.div`
      width: 90px;
      height: 90px;
      border-radius: ${({ theme }) => theme.radius * 1.5}px;
      border: solid 1px ${({ theme }) => theme.stroke};
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${props =>
        props.active ? props.theme.whitePrimary : props.theme.stroke};
    `,
    Name: styled.div`
      margin-top: ${({ theme }) => theme.space.s4 / 1.5}px;
      color: ${({ theme }) => theme.grayBlue};
    `,
  },
};
