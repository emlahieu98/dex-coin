import React, { memo, useEffect, useState } from 'react';
import { Button, Form } from 'app/components';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCategoriesSlice } from 'app/pages/Categories/slice';
import CategoriesModal from 'app/components/Modal/CategoriesModal';
import { selectData } from 'app/pages/Categories/slice/selectors';
import { CustomStyle } from 'styles/commons';
import Styled from 'styled-components';
// import { CustomSectionWrapper } from './styled';
const Item = Form.Item;

function CategoryChild({ data, onChange = () => null }) {
  const [showModal, setShowModal] = useState(true);
  const dispatch = useDispatch();
  const listCategories = useSelector(selectData);
  const categoriesSlice = useCategoriesSlice();

  useEffect(() => {
    if (isEmpty(listCategories)) {
      dispatch(categoriesSlice.actions.getData(''));
    }
  }, [listCategories]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const customChange = value => {
    onChange(value);
    toggleModal();
  };

  // const suggestValue = data?.length === 1 && data[0].display_path;

  return (
    <>
      {!isEmpty(data) ? (
        <CustomStyle>
          {isEmpty(data) ||
            data.map(v => (
              <CustomStyle
                border="1px solid"
                borderColor="stroke"
                padding="0 12px"
                marginBottom="5px"
              >
                {v?.display_path || v}{' '}
                {/* <CloseOutlined
                      onClick={deleteItem(v.id)}
                      style={{ paddingLeft: 5, color: '#EE496B' }}
                    /> */}
              </CustomStyle>
            ))}
        </CustomStyle>
      ) : (
        ''
      )}
      <CustomButton
        context="secondary"
        onClick={toggleModal}
        color="green"
        width="100%"
        className="btn-sm justify-content-start"
      >
        Chọn ngành hàng shopee tương ứng
      </CustomButton>
      {showModal && (
        <CategoriesModal
          isOpen={showModal}
          // defaultSuggestValue={suggestValue}
          data={listCategories}
          defaultActives={data || []}
          className="modal-1"
          callBackCancel={toggleModal}
          handleConfirm={customChange}
        />
      )}
    </>
  );
}

export default memo(function Category({ layout, ...res }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    // <CustomSectionWrapper mt={{ xs: 's4' }}>
    <CustomStyle mb={{ xs: 's7' }}>
      <Item
        name="info_mapped"
        label="Ngành hàng shopee tương ứng:"
        valuePropName="data"
        getValueFromEvent={normFile}
        {...layout}
        // rules={[
        //   {
        //     required: true,
        //     message: 'Vui lòng chọn danh mục!',
        //   },
        // ]}
      >
        <CategoryChild {...res} />
      </Item>
    </CustomStyle>
    // </CustomSectionWrapper>
  );
});

const CustomButton = Styled(Button)`
  &:hover, &.active {
    background: transparent !important;
    color: ${({ theme }) => theme.text} !important;
  }
`;
