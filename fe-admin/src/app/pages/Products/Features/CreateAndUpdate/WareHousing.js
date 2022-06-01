import React, { memo } from 'react';
// import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';
import { isEmpty } from 'lodash';
import { CustomSectionWrapper } from './styled';

export default memo(function WareHousing({ data }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Kho hàng</div>
      <CustomStyle color="darkBlue3" fontWeight="bold" mb={{ xs: 's6' }}>
        {!isEmpty(data?.supplier_warehousing)
          ? data?.supplier_warehousing?.name
          : 'Sản phẩm này không có kho!'}
      </CustomStyle>
    </CustomSectionWrapper>
  );
});
