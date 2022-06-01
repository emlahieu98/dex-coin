import React, { memo, useEffect, useState, useMemo } from 'react';
import { Row, Col, Form as F, Tree } from 'antd';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCategoriesSlice } from 'app/pages/Categories/slice';
import { selectData } from 'app/pages/Categories/slice/selectors';
// import constants from 'assets/constants';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function CategoryProduct({ layout, form }) {
  const dispatch = useDispatch();
  const listCategories = useSelector(selectData);
  const categoriesSlice = useCategoriesSlice();
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const { setFieldsValue, getFieldsValue } = form;
  const { categories } = getFieldsValue();

  useEffect(() => {
    if (!isEmpty(categories)) {
      const listChecked = [];
      categories.forEach(currentItem => {
        listChecked.push(
          `${currentItem.parent_id ? `${currentItem.parent_id}-` : ''}${
            currentItem.id
          }`,
        );
      });
      setExpandedKeys(listChecked);
      setCheckedKeys(listChecked);
    }
  }, [categories]);

  useEffect(() => {
    if (isEmpty(listCategories)) {
      dispatch(categoriesSlice.actions.getData({ page: 0, page_size: 1000 }));
    }
  }, [listCategories]);

  const handleListCategories = useMemo(() => {
    const list = [];
    function changeIdToKey(arr, id, keyChild) {
      if (id) {
        list[keyChild].children = [];
      }
      arr.forEach((item, key) => {
        if (id) {
          list[keyChild].children = [
            ...list[keyChild].children,
            { ...item, key: `${id}-${item.id?.toString()}` },
          ];
        } else {
          list.push({ ...item, key: item.id?.toString() });
        }
        if (!isEmpty(item.children)) {
          changeIdToKey(item.children, item.id, key);
        }
      });
    }
    changeIdToKey(listCategories);
    return list;
  }, [listCategories]);

  const onExpand = expandedKeysValue => {
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = checkedKeysValue => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Phân loại sản phẩm</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="categories"
            label=""
            // valuePropName="treeData"
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your status!',
            //   },
            // ]}
          >
            <Tree
              checkable
              disabled
              onExpand={onExpand}
              titleRender={item => item.name}
              key="id"
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={handleListCategories}
            />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
