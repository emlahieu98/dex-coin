import React, { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import request from 'utils/request';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
// import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Space, Skeleton, Modal, Checkbox } from 'antd';
import { selectDetail } from '../../../slice/selectors';
import { useSuppliersSlice } from '../../../slice';
import { Button, Form, Input } from 'app/components';
import { done, exclamationMark } from 'assets/images/icons';
import { identityAfter, identityBefore } from 'assets/images/identity';
import { PicturesWall } from 'app/components/Uploads';
import { SectionWrapper } from 'styles/commons';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import { selectListStores } from '../slice/selectors';

const { TextArea } = Input;
const Item = Form.Item;
const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const Reasons = [
  {
    id: 2,
    label: 'Ảnh CMT/ CCCD không hợp lệ hoặc bị mờ',
    value: 'Ảnh CMT/ CCCD không hợp lệ hoặc bị mờ',
  },
  {
    id: 3,
    label: 'Giấy phép kinh doanh không hợp lệ',
    value: 'Giấy phép kinh doanh không hợp lệ',
  },
  {
    id: 4,
    label: 'Thông tin tài khoản thanh toán không hợp lệ',
    value: 'Thông tin tài khoản thanh toán không hợp lệ',
  },
  {
    id: 5,
    label: 'Địa chỉ kho hàng không tồn tại',
    value: 'Địa chỉ kho hàng không tồn tại',
  },
  { id: 1, label: 'Lí do khác', value: 'Lí do khác' },
];

export default memo(function Info({ id }) {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const dispatch = useDispatch();

  const { actions } = useSuppliersSlice();
  const data = useSelector(selectDetail);

  const [isLoading, setIsLoading] = useState('');

  const [isHadImage, setIsHadImage] = useState('');
  const [isShowUpload, setisShowUpload] = useState(true);
  const [isShowUploadFile, setisShowUploadFile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesSupplier, setCategoriesSupplier] = useState([]);
  const [defaultBankSupplier, setDefaultBankSupplier] = useState('');

  const [reasonReject, setReasonReject] = useState('');

  const { setFieldsValue, getFieldsValue } = form2;
  const [visibleModal, setVisibleModal] = useState('');
  const [visibleModalReject, setVisibleModalReject] = useState('');

  useEffect(() => {
    return () => {
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data?.metadata?.business_info?.images_license)) {
      setisShowUpload(true);
      setIsHadImage(true);
    } else {
      setisShowUpload(false);
      setIsHadImage(false);
    }
  }, [data]);

  useEffect(() => {
    const getDefaultBankSupplier = async () => {
      setIsLoading(true);

      const url = `user-service/admin/${id}/bank-detail?is_default=true`;
      const response = await request(url, {
        method: 'get',
      })
        .then(response => response)
        .catch(error => error);

      if (response.data) {
        await setDefaultBankSupplier(response.data[0]);
      }
      setIsLoading(false);
    };

    getDefaultBankSupplier();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);

      const url =
        'product-service/categories-listing?page=1&page_size=1000&is_top=true';
      const response = await request(url, {
        method: 'get',
      })
        .then(response => response)
        .catch(error => error);

      if (response.data) {
        await setCategories(response.data);
      }
      setIsLoading(false);
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (!isEmpty(categories) && !isEmpty(data)) {
      let temp = [];
      categories?.map(category => {
        data?.category_ids?.map(categoryId => {
          if (categoryId === category.id) {
            temp.push(category);
            setCategoriesSupplier(temp);
          }
        });
      });
    }
  }, [data, categories]);

  const CategoryItem = props => {
    return (
      <div className="category__item active" key={props.category.id}>
        <div className="category__item_thumb">
          <img src={props.category.thumb?.origin} alt="" />
        </div>

        <div className="category__item_name">{props.category.name}</div>
      </div>
    );
  };

  const handleAppraiseSupplier = async type => {
    dispatch(
      actions.TransferStatusSupplierDetail({
        id,
        data: {
          ...data,
          // status: 'active',
          supplier_status: type === 'active' ? 'active' : 'inactive',
          register_status: type === 'active' ? 'active' : 'reject',
          note:
            type === 'active'
              ? ''
              : reasonReject +
                (getFieldsValue().note ? ', ' + getFieldsValue().note : ''),
        },
      }),
    );
    onClose();
  };

  const handleTranferStatusSupplier = async type => {
    await dispatch(
      actions.UpdateSupplierDetail({
        id,
        data: {
          status: type,
        },
      }),
    );
    await dispatch(actions.getDetail(id));
  };

  const handleShowModal = type => {
    if (type === 'approve') setVisibleModal(true);
    else if (type === 'reject') setVisibleModalReject(true);
  };

  const onChangeReason = reasons => {
    setReasonReject(reasons);
  };

  const onClose = () => {
    setVisibleModal(false);
    setVisibleModalReject(false);
  };

  return (
    <>
      <Modal
        name="modal-approve"
        visible={visibleModal}
        footer={null}
        onCancel={onClose}
      >
        <Form
          form={form2}
          name="form-approve"
          onFinish={() => handleAppraiseSupplier('active')}
        >
          <CustomDiv>
            <CheckCircleOutlined className="icon icon-check" />
            <div>
              <div className="title-modal">
                Xác nhận: Duyệt Thông tin Doanh nghiệp
              </div>
              <div className="desc-modal">
                Hành động này không thể thu hồi. Bạn chắc chắn vẫn duyệt?
              </div>
            </div>
          </CustomDiv>
          {/* <CustomItemModal name="note">
            <TextArea
              className="textArea"
              showCount
                maxLength={300}
                rows={4}
              placeholder="Nhập nội dung"
            />
          </CustomItemModal> */}

          <CustomItemModal>
            <Button
              type="primary"
              className="btn-sm btn-action"
              color="blue"
              htmlType="submit"
            >
              Xác nhận
            </Button>
          </CustomItemModal>
        </Form>
      </Modal>
      <Modal
        name="modal-reject"
        visible={visibleModalReject}
        footer={null}
        onCancel={onClose}
      >
        <Form
          form={form2}
          name="form-reject"
          onFinish={() => handleAppraiseSupplier('reject')}
        >
          <CustomDiv>
            <CloseCircleOutlined className="icon icon-close" />
            <div>
              <div className="title-modal">
                Xác nhận: Từ chối Thông tin Doanh nghiệp
              </div>
              <div className="desc-modal">
                Hành động này không thể thu hồi. Bạn chắc chắn vẫn duyệt?
              </div>
            </div>
          </CustomDiv>
          <CustomItemModal name="reason">
            <div className="title-reason">Lý do từ chối ?</div>
            <Checkbox.Group options={Reasons} onChange={onChangeReason} />
          </CustomItemModal>
          <CustomItemModal name="note">
            <TextArea
              className="textArea"
              showCount
              maxLength={300}
              rows={4}
              placeholder="Nhập nội dung"
            />
          </CustomItemModal>

          <CustomItemModal>
            <Button
              type="primary"
              context="secondary"
              className="btn-sm btn-action"
              color="orange"
              htmlType="submit"
            >
              Từ chối
            </Button>
          </CustomItemModal>
        </Form>
      </Modal>
      <Form
        form={form}
        name="supplier-form__info"
        className="supplier-form"
        fields={[
          //name supplier
          {
            name: ['name'],
            value: data?.name,
          },
          {
            name: ['representative_name'],
            value: data?.metadata?.user_info?.representative_name,
          },
          {
            name: ['contact_email'],
            value: data?.contact_email,
          },
          {
            name: ['phone_number'],
            value: data?.phone_number,
          },
          {
            name: ['identity_card'],
            value: data?.metadata?.user_info?.identity_card,
          },
          {
            name: ['images_representative_before'],
            value: [data?.metadata?.user_info?.images_representative_before],
          },
          {
            name: ['images_representative_after'],
            value: [data?.metadata?.user_info?.images_representative_after],
          },
          // location
          {
            name: ['country'],
            value: data?.address?.country,
          },
          {
            name: ['province'],
            value: data?.address?.province,
          },
          {
            name: ['zip'],
            value: data?.address?.zip,
          },
          {
            name: ['district'],
            value: data?.address?.district_name,
          },
          {
            name: ['address1'],
            value: data?.address?.address1,
          },
          // billing info
          {
            name: ['title'],
            value: defaultBankSupplier?.bank_data?.title,
          },
          {
            name: ['account_number'],
            value: defaultBankSupplier?.account_number,
          },
          {
            name: ['account_name'],
            value: defaultBankSupplier?.account_name,
          },
          {
            name: ['sub_title'],
            value: defaultBankSupplier?.sub_title || '',
          },

          // categories

          // Image License
          {
            name: ['image-license'],
            value: data?.metadata?.business_info?.images_license,
          },
        ]}
      >
        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <>
              {!isEmpty(data?.note) && (
                <TxtReason className="d-flex justify-content-start">
                  <span>Lý do từ chối:</span> &ensp;{data?.note}
                </TxtReason>
              )}
              <div className="section__top">
                <div className="title">Thông tin Nhà cung cấp</div>
                <div className="desc">
                  Thông tin cơ bản của công ty để Odii hỗ trợ bạn tốt hơn.
                </div>
              </div>
            </>
          )}
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 10 }} className="loading" />
            ) : (
              <Row>
                <Col xs={24}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <CustomItem
                        name="representative_name"
                        label="Họ và Tên người đại diện"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Vui lòng nhập Họ tên người đại diện"
                          disabled={true}
                        />
                      </CustomItem>
                      <CustomItem
                        name="contact_email"
                        label="Email liên hệ"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập email liên hệ"
                          type="email"
                          disabled={true}
                        />
                      </CustomItem>
                    </Col>
                    <Col span={12}>
                      <CustomItem
                        name="phone_number"
                        label="Số điện thoại"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          type="number"
                          disabled={true}
                        />
                      </CustomItem>
                      <CustomItem
                        name="identity_card"
                        label="Số CMND / Thẻ căn cước"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                            message: '9 số CMND hoặc 12 số thẻ căn cước',
                          },
                        ]}
                      >
                        <Input
                          placeholder="9 số CMND hoặc 12 số thẻ căn cước"
                          type="number"
                          disabled={true}
                        />
                      </CustomItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <CustomItem
                        name="identity_image"
                        label="Upload ảnh CMND / Thẻ căn cước"
                        {...layout}
                        className="odii-form-item"
                      >
                        <CustomDivImageIdentity gutter={24}>
                          <Col span={12}>
                            <div className="images">
                              <div className="item">
                                <Item
                                  name="images_representative_before"
                                  label=""
                                  valuePropName="data"
                                  {...layout}
                                >
                                  <PicturesWall
                                    maxImages={1}
                                    onRemove={false}
                                  />
                                </Item>

                                <div className="title">Mặt trước</div>
                              </div>

                              <div className="item">
                                <Item
                                  name="images_representative_after"
                                  label=""
                                  valuePropName="data"
                                  {...layout}
                                >
                                  <PicturesWall
                                    maxImages={1}
                                    onRemove={false}
                                  />
                                </Item>

                                <div className="title">Mặt sau</div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12} className="note">
                            <div className="image">
                              <img
                                className="image_before"
                                src={identityBefore}
                                alt=""
                              />
                              <img
                                className="image_after"
                                src={identityAfter}
                                alt=""
                              />
                            </div>
                            <div className="content">
                              Lưu ý: Ảnh chụp cần rõ nét, căn giữa CMND hoặc Căn
                              Cước để xem được đầy đủ thông tin
                            </div>
                          </Col>
                        </CustomDivImageIdentity>
                      </CustomItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </SectionWrapper>
        </CustomSection>

        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <div className="section__top">
              <div className="title">Thông tin Địa chỉ</div>
              <div className="desc">Địa chỉ liên hệ của Nhà Cung Cấp</div>
            </div>
          )}
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} className="loading" />
            ) : (
              <>
                <Row>
                  <Col xs={24}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <CustomItem
                          name="country"
                          label="Quốc gia"
                          {...layout}
                          className="odii-form-item"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input placeholder="Quốc gia" disabled={true} />
                        </CustomItem>
                        <CustomItem
                          name="province"
                          label="Tỉnh/ Thành phố"
                          {...layout}
                          className="odii-form-item"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            placeholder="Tỉnh/ Thành phố"
                            disabled={true}
                          />
                        </CustomItem>
                      </Col>
                      <Col span={12}>
                        <CustomItem
                          name="zip"
                          label="Mã vùng (Zip/postal code)"
                          {...layout}
                          className="odii-form-item"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            placeholder="Mã vùng (Zip/postal code)"
                            type="number"
                            disabled={true}
                          />
                        </CustomItem>
                        <CustomItem
                          name="district"
                          label="Quận/ Huyện"
                          {...layout}
                          className="odii-form-item"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input placeholder="Quận/ Huyện" disabled={true} />
                        </CustomItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <CustomItem
                      name="address1"
                      label="Số nhà & Tên đường"
                      {...layout}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Địa chỉ Số nhà & Tên đường"
                        disabled={true}
                      />
                    </CustomItem>
                  </Col>
                </Row>
              </>
            )}
          </SectionWrapper>
        </CustomSection>

        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <div className="section__top">
              <div className="title">Thông tin kinh doanh</div>
              <div className="desc">Thông tin kinh doanh của Nhà Cung Cấp</div>
            </div>
          )}
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 10 }} className="loading" />
            ) : (
              <div className="supplier_setting__section_bottom">
                <div className="odii-form">
                  <div className="odii-form-dual">
                    <div className="odii-form-dual-item">
                      <CustomItem
                        name="name"
                        label="Tên gian hàng"
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Tên gian hàng kinh doanh online của bạn"
                          disabled={true}
                        />
                      </CustomItem>
                      <CustomItem
                        name="category"
                        label="Ngành hàng"
                        className="odii-form-item"
                      >
                        <CustomCategories>
                          {categoriesSupplier?.map(category => (
                            <CategoryItem category={category} />
                          ))}
                        </CustomCategories>
                      </CustomItem>

                      <div className="odii-form-item ">
                        <div className="odii-form-label">
                          Giấy phép kinh doanh
                        </div>
                        <div>
                          Hình ảnh, tập tin các giấy tờ bắt buộc theo ngành hàng
                          của Nhà cung cấp.
                        </div>
                      </div>

                      <CustomLicense className="odii-form-item ">
                        <div className="title">
                          <div className="d-flex">
                            <img
                              className="iconLicense"
                              src={exclamationMark}
                              alt=""
                            />
                            <div>File dữ liệu</div>
                          </div>
                          {!isShowUploadFile ? (
                            <RightOutlined
                              onClick={() =>
                                setisShowUploadFile(!isShowUploadFile)
                              }
                            />
                          ) : (
                            <DownOutlined
                              onClick={() =>
                                setisShowUploadFile(!isShowUploadFile)
                              }
                            />
                          )}
                        </div>
                        {isShowUploadFile ? (
                          <div className="odii-form-upload"></div>
                        ) : (
                          ''
                        )}
                        <div className="title">
                          <div className="d-flex">
                            <img
                              className="iconLicense"
                              src={isHadImage ? done : exclamationMark}
                              alt=""
                            />
                            <div>Hình ảnh</div>
                          </div>
                          {!isShowUpload ? (
                            <RightOutlined
                              onClick={() => setisShowUpload(!isShowUpload)}
                            />
                          ) : (
                            <DownOutlined
                              onClick={() => setisShowUpload(!isShowUpload)}
                            />
                          )}
                        </div>
                        {isShowUpload ? (
                          <div className="odii-form-upload">
                            <Item
                              name="image-license"
                              label=""
                              valuePropName="data"
                              {...layout}
                            >
                              <PicturesWall
                                maxImages={8}
                                onRemove={false}
                                // url="common-service/upload-image-file?source=admin"
                              />
                            </Item>
                          </div>
                        ) : (
                          ''
                        )}
                      </CustomLicense>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SectionWrapper>
        </CustomSection>

        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <div className="section__top">
              <div className="title">Thông tin thanh toán</div>
              <div className="desc">
                Thông tin tài khoản ngân hàng nhận thanh toán của bạn. Odii sẽ
                chuyển khoản doanh thu kinh doanh của bạn vào tài khoản này
              </div>
            </div>
          )}
          <SectionWrapper>
            {/* <BillingInfo layout={layout} form={form} /> */}
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} className="loading" />
            ) : (
              <Row>
                <Col xs={24}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <CustomItem
                        name="title"
                        label="Ngân hàng "
                        className="odii-form-item"
                        {...layout}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="Ngân hàng" disabled={true} />
                      </CustomItem>
                      <CustomItem
                        name="account_number"
                        label="Số tài khoản"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Số tài khoản ngân hàng"
                          disabled={true}
                        />
                      </CustomItem>
                    </Col>
                    <Col span={12}>
                      <CustomItem
                        name="sub_title"
                        label="Chi nhánh"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Tên chi nhánh ngân hàng"
                          disabled={true}
                        />
                      </CustomItem>
                      <CustomItem
                        name="account_name"
                        label="Tên chủ tài khoản"
                        {...layout}
                        className="odii-form-item"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Họ Tên chủ tài khoản"
                          disabled={true}
                        />
                      </CustomItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </SectionWrapper>
        </CustomSection>
      </Form>
      {data?.status === 'active' &&
        // data?.supplier_status === 'inactive' &&
        (data?.register_status === 'pending_for_review' ||
          data?.register_status === 'pending_for_review_after_update') && (
          <CustomSection>
            <Space className="action">
              <Button
                context="secondary"
                color="orange"
                onClick={() => handleShowModal('reject')}
                className="btn-sm btn-cancel"
              >
                <span>Từ chối</span>
              </Button>
              <Button
                // type="primary"
                className="btn-sm mr-2"
                onClick={() => handleShowModal('approve')}
                color="blue"
              >
                <span>Xác nhận</span>
              </Button>
            </Space>
          </CustomSection>
        )}
      {data?.status === 'active' &&
        // data?.supplier_status === 'active' &&
        data?.register_status === 'active' && (
          <CustomSection>
            <Space className="action">
              <Button
                context="secondary"
                color="orange"
                onClick={() => handleTranferStatusSupplier('inactive')}
                className="btn-sm"
              >
                Tạm ẩn
              </Button>
            </Space>
          </CustomSection>
        )}

      {data?.status === 'inactive' &&
        // data?.supplier_status === 'active' &&
        data?.register_status === 'active' && (
          <CustomSection>
            <Space className="action">
              <Button
                // type="primary"
                color="blue"
                onClick={() => handleTranferStatusSupplier('active')}
                className="btn-sm"
              >
                Kích hoạt
              </Button>
            </Space>
          </CustomSection>
        )}
    </>
  );
});

const TxtReason = styled.div`
  color: #ff4d4f;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
`;
const CustomSection = styled.div`
  .section__top {
    .title {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 14px;
    }
  }
  &:not(:first-child) {
    margin-top: 30px;
  }
  .action {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
    margin-right: 2px;
  }
  .btn-cancel {
    background: #fff;
    &:hover {
      color: #fff;
      background: red;
    }
  }
  button:focus {
    box-shadow: 0 0 0 1px #ff0d5b !important;
  }
`;

const CustomItem = styled(Item)`
  display: block;

  .ant-form-item {
    &-label {
      margin-bottom: 6px;
      label {
        &::after {
          content: '';
        }
      }
      font-weight: 500;
      margin-bottom: $spacer/2;
    }
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
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
`;

const CustomLicense = styled.div`
  /* padding: 14px 0 18px; */
  .title {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    &:first-child {
      border-bottom: 1px solid #ebebf0;
    }
  }
  .iconLicense {
    margin-right: 10px;
  }
  .anticon-right {
    margin-top: 6px;
  }
  .odii-form-upload {
    margin-top: 24px;
    min-height: 100px;
  }
  .ant-upload-select {
    max-width: 100%;
    max-height: 168px;
  }
  .ant-upload-select {
    visibility: hidden;
  }
  .ant-upload-list-item-card-actions-btn.ant-btn-sm {
    display: none;
  }
`;

const CustomDivImageIdentity = styled(Row)`
  .images {
    display: flex;
    height: 100%;
    .item {
      width: 50%;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      &:first-child {
        margin-right: 24px;
      }
      .ant-form-item {
        margin-top: 28px;
        margin-bottom: 0;
      }
      .title {
        margin-top: 14px;
        text-align: center;
        color: #828282;
      }
      .ant-form-item-control-input {
        margin: auto;
      }
      .ant-upload-list-item-card-actions-btn.ant-btn-sm {
        display: none;
      }
    }
  }
  .note {
    .image {
      text-align: center;
      .image_after {
        position: relative;
      }
      .image_before {
        position: absolute;
        top: 32px;
        left: 212px;
        z-index: 2;
      }
    }
    .content {
      margin-top: 51px;
      font-size: 12px;
      line-height: 19px;
      text-align: center;
    }
  }
`;

const CustomCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  .category {
    &__item {
      border: solid 1px #ebebf0;
      width: 23%;
      display: inline-flex;
      align-items: center;
      padding: ${({ theme }) => (theme.space.s4 / 6) * 5}px
        ${({ theme }) => theme.space.s4}px;
      margin-bottom: 24px;
      border-radius: 4px;
      cursor: pointer;

      /* &:not(:nth-child(4n)) {
        margin-right: 24px;
      } */

      &.active {
        border-color: #3d56a6;
        color: #3d56a6;
        font-weight: 500;
        border-width: 2px;
        padding: ${({ theme }) => (theme.space.s4 / 6) * 5 - 1}px
          ${({ theme }) => theme.space.s4 - 1}px;
        &:not(:nth-child(4n)) {
          margin-right: 24px;
        }
      }

      &_thumb {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: ${({ theme }) => theme.space.s4 / 3}px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
        }
      }
    }
  }
`;

const CustomDiv = styled.div`
  display: flex;
  margin-bottom: 12px;
  .icon {
    margin-right: 8px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .icon-check {
    color: #27ae60;
  }
  .icon-close {
    color: #eb5757;
  }
  .title-modal {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .desc-modal {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
`;

const CustomItemModal = styled(Item)`
  margin-top: 24px;
  .title-reason {
    margin-bottom: 10px;
  }
  .ant-checkbox-group {
    .ant-checkbox-group-item {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 20px;
      }
    }
    .ant-checkbox-inner {
      border-radius: 4px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #3d56a6;
      border-color: #3d56a6;
    }
    .ant-checkbox-group-item + .ant-checkbox-group-item {
      width: 100%;
    }
  }
  textarea {
    border-radius: 6px;
    border: 1px solid #ebebf0;
  }
  .btn-action {
    margin-left: auto;
  }
`;
