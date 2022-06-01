import React, { memo, useMemo, useState, useEffect } from 'react';
import { Space, Menu, Dropdown } from 'antd';
import { formatVND } from 'utils/helpers';
import styled from 'styled-components';
import { List } from 'antd';
import { flatten, intersectionWith, isEmpty, union } from 'lodash';
import { Table, Image, Button } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { DownOutlined } from '@ant-design/icons';
import { CustomSectionWrapper } from './styled';
import { EditPrice } from './modals';

export default memo(function ListVariations({
  variations,
  setVariations,
  // form,
}) {
  // const { getFieldsValue } = form;
  // const { categories } = getFieldsValue();

  const [listSelected, setListSelected] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [currentOption, setCurrentOption] = useState([]);
  const [statusModal, setStatusModal] = useState('');

  // useEffect(() => {
  //   if (!isEmpty(categories)) {
  //     const listChecked = [];
  //     categories.forEach(currentItem => {
  //       listChecked.push(
  //         `${currentItem.parent_id ? `${currentItem.parent_id}-` : ''}${
  //           currentItem.id
  //         }`,
  //       );
  //     });
  //   }
  // }, [categories]);

  useEffect(() => {
    const handlePushOption = (type, list, item, position) => {
      if (
        list[position].every(v => type !== v.type || item[type] !== v.value)
      ) {
        list[position].push({ type: type, value: item[type] });
      }
    };
    const listChildOption = variations.reduce(
      (final, item) => {
        if (item.option_1) {
          handlePushOption('option_1', final, item, 0);
        }
        if (item.option_2) {
          handlePushOption('option_2', final, item, 1);
        }
        if (item.option_3) {
          handlePushOption('option_3', final, item, 2);
        }
        return final;
      },
      [[], [], []],
    );
    setListOption(flatten(listChildOption));
  }, [variations]);

  const { columns } = useMemo(() => {
    return {
      columns: [
        {
          title: (
            <div className="custome-header">
              <div className="title-box">ID</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          width: 60,
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Option</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'name',
          key: 'name',
          width: 170,
          render: (text, record) => (
            <WrapperOption>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Image size="200x200" src={record?.thumb?.location} />
                  }
                  title={text}
                  description={`${record.option_1}${
                    record.option_2 ? `/${record.option_2}` : ''
                  }${record.option_3 ? `/${record.option_3}` : ''}`}
                />
              </List.Item>
            </WrapperOption>
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">SKU/Barcode</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'SKU/Barcode',
          key: 'SKU/Barcode',
          width: 170,
          render: (_, record) => (
            <div className="">
              <CustomStyle>{record?.sku || '..'}</CustomStyle>
              <CustomStyle>{record.barcode}</CustomStyle>
            </div>
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Giá NCC</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'origin_supplier_price',
          key: 'origin_supplier_price',
          width: 120,
          render: text => formatVND(text),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Giá Odil</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'odii_price',
          key: 'odii_price',
          width: 120,
          render: text => (
            <CustomStyle fontWeight="medium" className="text-primary">
              {formatVND(text)}
            </CustomStyle>
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Giá km</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'odii_compare_price',
          key: 'odii_compare_price',
          width: 120,
          render: text => formatVND(text),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Số lượng</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'total_quantity',
          key: 'total_quantity',
          width: 120,
        },
      ],
    };
  }, [variations]);

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);
      setListSelected(selectedRowKeys);
    },
  };

  const handleSelect = (type, value) => () => {
    if (type !== 'none' && currentOption.some(item => item.type === 'all'))
      return;
    let newSelected = listSelected;
    let newOption = currentOption.some(item => item.value === value)
      ? currentOption
      : [...currentOption, { type, value }];
    let optionSelected = listOption;
    const handleOption = params => {
      const lists = variations
        .filter(item => item.active || item[params] === value)
        .map(item => item.id);
      newSelected = union(lists, newSelected);
      optionSelected = listOption.map(item => ({
        ...item,
        active: item.active || item.value === value,
      }));
      // return { newSelected, optionSelected };
    };
    switch (type) {
      case 'all':
        newOption = [{ type, value }];
        newSelected = variations.map(item => item.id);
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'none':
        newSelected = [];
        newOption = [];
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'option_1':
        handleOption('option_1');
        break;
      case 'option_2':
        handleOption('option_2');
        break;
      case 'option_3':
        handleOption('option_3');
        break;

      default:
        break;
    }
    setCurrentOption(newOption);
    setListSelected(newSelected);
    setListOption(optionSelected);
  };

  const handleMenuClick = Type => () => {
    setStatusModal(Type);
  };

  const handleModalShow = () => {
    const listModal = [
      {
        title: 'Sửa giá Odii và khuyến mại',
        Component: EditPrice,
      },
    ];
    return (
      <Menu>
        {listModal.map(({ title, Component }) => (
          <Menu.Item
            onClick={handleMenuClick(
              <Component
                title={title}
                data={intersectionWith(
                  variations,
                  listSelected,
                  (o, id) => o.id === id,
                )}
                variations={variations}
                setVariations={setVariations}
                callBackCancel={handleMenuClick('')}
              />,
            )}
            key={title}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Varriant đang có</div>
        <CustomStyle className="" mb={{ xs: 's5' }}>
          <Space wrap>
            <span>Chọn:</span>
            <Button
              context="secondary"
              color="transparent"
              className={
                currentOption.some(item => item.type === 'all') ? 'active' : ''
              }
              onClick={handleSelect('all')}
            >
              Chọn tất cả
            </Button>
            <Button
              context="secondary"
              color="transparent"
              onClick={handleSelect('none')}
            >
              Bỏ chọn
            </Button>
            {listOption.map(item => (
              <Button
                context="secondary"
                className={item.active ? 'active' : ''}
                color="transparent"
                onClick={handleSelect(item.type, item.value)}
              >
                {item.value}
              </Button>
            ))}
          </Space>
        </CustomStyle>

        {isEmpty(listSelected) || (
          <CustomStyle pb={{ xs: 's5' }} className="d-flex align-items-center">
            <CustomStyle fontWeight="bold" px={{ xs: 's5' }}>
              Chọn {listSelected.length} sản phẩm
            </CustomStyle>
            <Dropdown overlay={handleModalShow()}>
              <Button
                className="btn-sm"
                // onClick={handleCancel}
                color="default"
                context="secondary"
              >
                Thao tác &nbsp; <DownOutlined />
              </Button>
            </Dropdown>
          </CustomStyle>
        )}

        <CustomTable
          className="custom"
          columns={columns}
          // rowClassName="pointer"
          dataSource={variations || []}
          rowSelection={{
            selectedRowKeys: listSelected,
            type: 'checkbox',
            ...rowSelection,
          }}
          scroll={{ x: 900, y: 5000 }}
          pagination={false}
          notNeedRedirect={true}
          rowKey={record => record.id}
        />
      </CustomSectionWrapper>
      {statusModal}
      {/* {statusModal === 'editPrice' && <EditPrice />} */}
    </div>
  );
});

const WrapperOption = styled.div`
  .ant-image {
    width: 32px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;

const CustomTable = styled(Table)`
  color: #4d4d4d;
`;
