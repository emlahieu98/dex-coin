/**
 *
 * Breadcrumb
 *
 */
import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components/macro';
import { Breadcrumb as B } from 'antd';
import { useSelector } from 'react-redux';
import { styledSystem } from 'styles/theme/utils';
import { Link, BoxColor } from 'app/components';
import { isEmpty } from 'lodash';
// import { useRouteMatch } from 'react-router-dom';
import { StyleConstants } from 'styles/StyleConstants';
import { CustomStyle } from 'styles/commons';
import { selectBreadcrumb } from 'app/pages/AppPrivate/slice/selectors';
import constants from 'assets/constants';

const { Item } = B;
const Breadcrumb = ({ location }) => {
  // const useRouteMatch1 = useRouteMatch('/products/uc/:id?');
  const dataBreadcrumb = useSelector(selectBreadcrumb);
  const [state, setState] = useState({
    url: null,
    menus: [],
    title: '',
    fixWidth: false,
  });

  useEffect(() => {
    const url = window.location.pathname;
    // if (url === state.url || isEmpty(dataBreadcrumb)) return;
    // const id = match?.params?.id; // is update
    let obj = [];
    switch (url) {
      case '/products':
        break;
      case '/categories':
        // obj = [
        //   {
        //     name: 'Danh mục',
        //   },
        //   {
        //     name: 'Danh sách',
        //   },
        // ];
        break;
      default:
        break;
    }

    setState({
      url,
      menus: obj,
      ...dataBreadcrumb,
    });
  }, [dataBreadcrumb, location]);

  const BoxStatus = text => {
    const currentStatus = constants.COMMON_STATUS.find(v => v.id === text);
    return (
      <BoxColor
        fontWeight="medium"
        colorValue={currentStatus?.color}
        width="120px"
      >
        {currentStatus?.name || ''}
      </BoxColor>
    );
  };
  return (
    isEmpty(state.menus) || (
      <CustomStyle
        bg="whitePrimary"
        borderBottom="1px solid"
        borderColor="#E6E6E9"
        py={{ xs: 's4' }}
        padding="14px 24px"
      >
        <WrapperBreadcrumb fixWidth={state.fixWidth}>
          <CustomBreadcrumb>
            {state.menus.map((item, key) => (
              <Item key={key}>
                {item.link ? (
                  <Link to={item.link}> {item.name}</Link>
                ) : (
                  item.name
                )}
              </Item>
            ))}
          </CustomBreadcrumb>
          <div className="d-flex justify-content-between">
            <CustomStyle
              fontSize={{ xs: 'f5' }}
              mt={{ xs: 's3' }}
              // mb={{ xs: 's4' }}
              fontWeight="semiBold"
            >
              {state.title}
              &ensp;
              {state.status && BoxStatus(state.status)}
            </CustomStyle>
            {state.actions && <CustomStyleBtn>{state.actions}</CustomStyleBtn>}
          </div>
        </WrapperBreadcrumb>
      </CustomStyle>
    )
  );
};

const CustomBreadcrumb = styledSystem(styled(B)`
  font-size: 12px;
  & + div {
    margin-top: 0;
    margin-bottom: -5px;
    min-height: 27px;
    & > div:first-child {
      margin-top: 0;
      margin-right: 100px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      & + div {
        margin-top: -14px;
        flex-shrink: 0;
      }
    }
  }
`);

const CustomStyleBtn = styled(CustomStyle)`
  margin-top: auto;
  margin-bottom: auto;
`;

const WrapperBreadcrumb = styledSystem(styled.div`
  /* max-width: ${({ fixWidth }) =>
    fixWidth
      ? `${StyleConstants.minWidth}`
      : 'auto'};
  margin: 0 auto;
  padding: ${({ fixWidth }) =>
    fixWidth ? '12px 24px 0' : '16px 24px 16px'}; */
  max-width: ${({ fixWidth }) =>
    fixWidth ? `${StyleConstants.bodyWidth}px` : 'auto'};
  margin: 0 auto;
  padding: 0 ${({ fixWidth }) => (fixWidth ? '0' : '24px')} 0;
`);

export default memo(Breadcrumb);
