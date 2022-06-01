import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components/macro';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { Row, Col, Spin, Divider, Modal, Skeleton } from 'antd';
import { Button, Image, EmptyPage, Form, Table, Input } from 'app/components';
import { CustomStyle, CustomH3, SectionWrapper } from 'styles/commons';
import { bgWarehousing } from 'assets/images';
import moment from 'moment';
import {
  UserOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { formatDate } from 'utils/helpers';

const Item = Form.Item;
const { TextArea } = Input;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export default memo(function Warehouse({ id }) {
  const [Warehouses, setWarehouses] = useState([]);
  const [ViewStyleList, setViewStyleList] = useState(
    localStorage.getItem('ViewstyleWarehouse'),
  );
  const [visibleModal, setVisibleModal] = useState('');
  const [dataDetailId, setDataDetailId] = useState('');
  const [isLoading, setIsLoading] = useState('');

  useEffect(() => {
    const getWarehouses = async () => {
      setIsLoading(true);

      const url = `user-service/admin/supplier-warehousing?supplier_id=${id}`;
      const response = await request(url, {
        method: 'get',
      })
        .then(response => response)
        .catch(error => error);

      if (response.data) {
        await setWarehouses(response.data);
      }
      setIsLoading(false);
    };

    getWarehouses();
  }, []);

  console.log('isLoading2', isLoading);
  const handleSetViewStyle = viewstyle => {
    setViewStyleList(viewstyle);
    localStorage.setItem('ViewstyleWarehouse', viewstyle);
  };

  const onClose = () => {
    setVisibleModal(false);
    setDataDetailId('');
  };

  const handleViewDetail = data => {
    setDataDetailId(data);
    setVisibleModal(true);
  };

  const columns = React.useMemo(
    () => [
      {
        title: 'Kho hàng',
        dataIndex: 'name',
        width: 140,
        render: (_text, record) => {
          return (
            <CustomDivName onClick={() => handleViewDetail(record)}>
              <CustomAvatar
                src={record.thumb?.origin}
                icon={<UserOutlined />}
              />
              &emsp;
              <div className="name">{record.name || 'N/A'}</div>
            </CustomDivName>
          );
        },
      },
      {
        title: 'Địa chỉ',
        width: 120,
        render: (_, record) => <div>{record?.location_data?.address1}</div>,
      },
      // {
      //   title: 'Quốc gia',
      //   width: 120,
      //   render: (_, record) => <div>{record?.location_data?.country}</div>,
      // },
      {
        title: 'Điện thoại',
        dataIndex: 'phone',
        width: 80,
        render: text => <div>0{text}</div>,
      },
      {
        title: 'Tổng SP',
        dataIndex: 'countProduct',
        width: 60,
      },
      {
        title: 'SP hết hàng',
        dataIndex: 'countInactiveProduct',
        width: 60,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        width: 140,
        render: text => <div>{formatDate(text)}</div>,
      },
    ],
    [Warehouses],
  );

  return (
    <Spin tip="Đang tải..." spinning={isLoading}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        <>
          <CustomDiv>
            <CustomStyle className="d-flex justify-content-between">
              <CustomH3 mb={{ xs: 's6' }}>Danh sách kho hàng</CustomH3>
              <div className="view-style">
                <div
                  className={ViewStyleList ? 'active' : ''}
                  onClick={() => handleSetViewStyle(true)}
                >
                  <AppstoreOutlined />
                </div>
                <div
                  className={!ViewStyleList ? 'active' : ''}
                  onClick={() => handleSetViewStyle(false)}
                >
                  <UnorderedListOutlined />
                </div>
              </div>
            </CustomStyle>
            {isEmpty(Warehouses) && (
              <CustomDivEmpty>
                <EmptyPage
                  style={{ height: 'calc(100vh - 200px)' }}
                ></EmptyPage>
              </CustomDivEmpty>
            )}
            {ViewStyleList ? (
              <Row gutter={{ xs: 8, sm: 16, md: 28 }}>
                {Warehouses.map(item => (
                  <Col xs={24} md={12}>
                    <CustomStyle key={item.id} className="" mb={{ xs: 's6' }}>
                      <Row>
                        <Col xs={10}>
                          <IncludeImage>
                            <Image size="100x100" src={item?.thumb?.location} />
                            <CustomStyle
                              fontSize={{ xs: 'f3' }}
                              mb={{ xs: 's2' }}
                              fontWeight="bold"
                            >
                              {item?.name}
                            </CustomStyle>
                            <CustomStyle
                              fontSize={{ xs: 'f1' }}
                              mb={{ xs: 's4' }}
                              color="gray3"
                            >
                              {item?.location_data?.address1}
                            </CustomStyle>
                            <Button
                              className="btn-sm"
                              context="secondary"
                              width="100%"
                              onClick={() => handleViewDetail(item)}
                            >
                              Xem chi tiết
                            </Button>
                          </IncludeImage>
                        </Col>

                        <Col xs={14}>
                          <RightBox>
                            <CustomStyle className="d-flex row">
                              <CustomStyle
                                className="col"
                                borderRight="1px solid"
                                borderColor="stroke"
                              >
                                <CustomStyle
                                  color="blackPrimary"
                                  fontWeight="bold"
                                  fontSize={{ xs: 'f4' }}
                                >
                                  {item.countProduct || <br />}
                                </CustomStyle>
                                <CustomStyle color="gray3">Tổng SP</CustomStyle>
                              </CustomStyle>

                              <CustomStyle pl={{ xs: 's6' }} className="col">
                                <CustomStyle
                                  color="blackPrimary"
                                  fontWeight="bold"
                                  fontSize={{ xs: 'f4' }}
                                >
                                  {item.countInactiveProduct || <br />}
                                </CustomStyle>
                                <CustomStyle color="gray3">
                                  SP hết hàng
                                </CustomStyle>
                              </CustomStyle>
                            </CustomStyle>

                            <Divider my={{ xs: 's5' }} />

                            <CustomStyle>
                              <CustomStyle
                                mb={{ xs: 's3' }}
                                className="d-flex justify-content-between"
                              >
                                <CustomStyle color="gray3">Mã kho</CustomStyle>
                                <CustomStyle>{item?.id}</CustomStyle>
                              </CustomStyle>
                              <CustomStyle
                                mb={{ xs: 's3' }}
                                className="d-flex justify-content-between"
                              >
                                <CustomStyle color="gray3">
                                  Quốc gia
                                </CustomStyle>
                                <CustomStyle>
                                  {item?.location_data?.country}
                                </CustomStyle>
                              </CustomStyle>
                              <CustomStyle
                                mb={{ xs: 's3' }}
                                className="d-flex justify-content-between"
                              >
                                <CustomStyle color="gray3">
                                  Điện thoại
                                </CustomStyle>
                                <CustomStyle>{item?.phone}</CustomStyle>
                              </CustomStyle>
                              <CustomStyle
                                mb={{ xs: 's3' }}
                                className="d-flex justify-content-between"
                              >
                                <CustomStyle color="gray3">
                                  Ngày tạo
                                </CustomStyle>
                                <CustomStyle>
                                  {item?.created_at
                                    ? moment(item.created_at).format(
                                        'DD/MM/YYYY',
                                      )
                                    : ''}
                                </CustomStyle>
                              </CustomStyle>
                            </CustomStyle>
                          </RightBox>
                        </Col>
                      </Row>
                    </CustomStyle>
                  </Col>
                ))}
              </Row>
            ) : (
              <CustomDivTable>
                <Table
                  className="table"
                  columns={columns}
                  dataSource={Warehouses}
                  scroll={{ x: 900, y: 5000 }}
                  // rowKey={record => record.id}
                />
              </CustomDivTable>
            )}
          </CustomDiv>
        </>
      )}

      <Modal
        name="modal_detail"
        visible={visibleModal}
        footer={null}
        width={1000}
        onCancel={onClose}
      >
        <Form
          name="form-detail"
          initialValues={
            {
              // remember: true,
            }
          }
          fields={[
            {
              name: ['name'],
              value: dataDetailId?.name,
            },
            {
              name: ['id'],
              value: dataDetailId?.id,
            },
            {
              name: ['phone'],
              value: dataDetailId?.phone,
            },
            {
              name: ['description'],
              value: dataDetailId?.description,
            },

            {
              name: ['thumb'],
              value: dataDetailId?.thumb,
            },

            // location
            {
              name: ['country'],
              value: dataDetailId?.location_data?.country,
            },
            {
              name: ['province'],
              value: dataDetailId?.location_data?.province,
            },
            {
              name: ['zip'],
              value: dataDetailId?.location_data?.zip,
            },
            {
              name: ['district'],
              value: dataDetailId?.location_data?.district_name,
            },
            {
              name: ['address1'],
              value: dataDetailId?.location_data?.address1,
            },
          ]}
        >
          <Item>
            <CustomH3>Chi tiết kho hàng</CustomH3>
          </Item>
          <CustomStyle mt={{ xs: 's4' }}>
            <Row>
              <Col xs={24} md={17}>
                <CustomSectionWrapper
                  className="h-100"
                  border="none"
                  borderRight="1px solid"
                  borderColor="stroke"
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Item name="name" label="Tên kho hàng" {...layout}>
                        <Input placeholder="Tên kho hàng" disabled={true} />
                      </Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Item name="id" label="Mã kho hàng" {...layout}>
                        <Input placeholder="Mã kho hàng" disabled={true} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item name="phone" label="Điện thoại" {...layout}>
                        <Input placeholder="Điện thoại" disabled={true} />
                      </Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={24}>
                      <Item name="description" label="Mô tả kho" {...layout}>
                        <TextArea
                          rows={4}
                          placeholder="Nội dung mô tả ngắn gọn về kho hàng"
                          disabled={true}
                        />
                      </Item>
                    </Col>
                  </Row>
                </CustomSectionWrapper>
              </Col>
              <Col xs={24} md={7}>
                <CustomSectionWrapper
                  className="h-100 d-flex flex-column align-items-center justify-content-center"
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  mb={{ md: 0 }}
                  borderLeft="none"
                  textAlign="center"
                >
                  <CustomImage
                    src={dataDetailId?.thumb ? dataDetailId?.thumb?.origin : ''}
                    alt=""
                  />
                  <CustomStyle
                    fontSize={{ xs: 'f3' }}
                    mb={{ xs: 's2' }}
                    fontWeight="bold"
                  >
                    Ảnh đại diện kho hàng
                  </CustomStyle>
                  <CustomStyle
                    fontSize={{ xs: 'f1' }}
                    mb={{ xs: 's4' }}
                    color="gray3"
                  >
                    Định dạng PNG, JPG. Dung lượng tối đa 5Mb
                  </CustomStyle>
                </CustomSectionWrapper>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <CustomSectionWrapper>
                  <Row>
                    <Col xs={24}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Item name="country" label="Quốc gia" {...layout}>
                            <Input placeholder="Quốc gia" disabled={true} />
                          </Item>
                          <Item
                            name="province"
                            label="Tỉnh/ Thành phố"
                            {...layout}
                          >
                            <Input
                              placeholder="Tỉnh/ Thành phố"
                              disabled={true}
                            />
                          </Item>
                        </Col>
                        <Col span={12}>
                          <Item
                            name="zip"
                            label="Mã vùng (Zip/postal code)"
                            {...layout}
                          >
                            <Input
                              placeholder="Mã vùng (Zip/postal code)"
                              type="number"
                              disabled={true}
                            />
                          </Item>
                          <Item name="district" label="Quận/ Huyện" {...layout}>
                            <Input placeholder="Quận/ Huyện" disabled={true} />
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Item
                        name="address1"
                        label="Số nhà & Tên đường"
                        {...layout}
                      >
                        <Input
                          placeholder="Địa chỉ Số nhà & Tên đường"
                          disabled={true}
                        />
                      </Item>
                    </Col>
                  </Row>
                </CustomSectionWrapper>
              </Col>
            </Row>
          </CustomStyle>
        </Form>
      </Modal>
    </Spin>
  );
});

const CustomAvatar = styled(Image)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;

const CustomDivName = styled.div`
  display: flex;
  cursor: pointer;
  .name {
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: #333333;
    margin: auto 0;
    &:hover {
      color: #40a9ff;
      text-decoration: underline;
    }
  }
`;
const CustomDivEmpty = styled.div`
  .style-1 {
    height: calc(100vh - 120px);
  }
`;

const CustomDiv = styled.div`
  .view-style {
    width: 80px;
    height: 32px;
    display: flex;
    border-radius: 4px;
    background: #ffffff;
    box-sizing: border-box;
    cursor: pointer;
    .active {
      color: #ffffff;
      background: #3d56a6;
      border: 1px solid #3d56a6;
    }
    .anticon {
      vertical-align: 0%;
    }
    & div {
      font-weight: 900;
      font-size: 16px;
      line-height: 28px;
      flex: 1 1;
      text-align: center;
      color: #6c798f;
      border: 1px solid #e6e6e9;
      &:first-child {
        border-right: unset;
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-left: unset;
        border-radius: 0px 4px 4px 0px;
      }
    }
  }
`;
const CustomDivTable = styled.div`
  .ant-table {
    padding: 21px;
  }
`;

export const IncludeImage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(${bgWarehousing});
  border-radius: 4px 0px 0px 4px;
  background-size: cover;
  border: 1px solid #e6e6e9;
  border-right: none;
  background-repeat: no-repeat;
  padding: ${({ theme }) => theme.space.s5}px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ant-image-img {
    margin-bottom: 12px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
`;

export const RightBox = styled(CustomStyle)`
  height: 100%;
  background: ${({ theme }) => theme.whitePrimary};
  border-radius: 0px 4px 4px 0px;
  border: 1px solid #e6e6e9;
  padding: ${({ theme }) => theme.space.s6}px ${({ theme }) => theme.space.s7}px;
`;

const CustomImage = styled(Image)`
  width: 120px;
  border-radius: 50%;
  /* img,
  .ant-upload.ant-upload-select-picture-card {
    border-radius: 50%;
  } */
`;

const CustomSectionWrapper = styled(SectionWrapper)`
  padding: 16px;
  padding-bottom: 0;
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
  label {
    font-weight: 500;
  }
`;
