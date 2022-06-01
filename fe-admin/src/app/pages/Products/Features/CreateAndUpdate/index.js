import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { Row, Col, Spin, Form as F, Space, Checkbox, message } from 'antd';
import { isEmpty, pickBy, identity } from 'lodash';
import { Button, PageWrapper, Input, Form } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';

import { CustomSectionWrapper } from './styled';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useProductsSlice } from '../../slice';
import { COMBINE_STATUS } from '../../constants';
import Price from './Price';
import Info from './Info';
import Counting from './Counting';
// import Status from './Status';
import AvatarProduct from './AvatarProduct';
import ProductImages from './ProductImages';
import Supplier from './Supplier';
import WareHousing from './WareHousing';
import Vendor from './Vendor';
import SortDescription from './SortDescription';
import Tags from './Tags';
import Options from './Options';
import ListVariations from './ListVariations';
// import CategoryProduct from './CategoryProduct';
import Shipping from './Shipping';
import { CustomStyle } from 'styles/commons';
import Description from './Description';

const Item = F.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 16 },
};

export function CreateAndUpdateProducts({ match, history }) {
  const id = match?.params?.id; // is update
  const dispatch = useDispatch();
  const { actions } = useProductsSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  // const [, forceUpdate] = useState();
  const [variations, setVariations] = useState([]);
  const [, setFormValues] = useState({});
  const [allStatus, setAllStatus] = useState({});

  const {
    setFieldsValue,
    getFieldsValue,
    resetFields,
    // isFieldsTouched,
    submit,
  } = form;
  const { has_variation } = getFieldsValue();

  useEffect(() => {
    if (!isEmpty(allStatus)) {
      submit();
    }
  }, [allStatus]);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Sản phẩm',
          link: '/products',
        },
        {
          name: id ? 'Chi tiết sản phẩm' : 'Thêm mới',
        },
      ],
      title: '',
      status: '',
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              <Button
                context="secondary"
                color="default"
                onClick={onClear}
                width="80px"
                className="btn-sm"
              >
                <span>Hủy bỏ</span>
              </Button>
              {/* <Button
                onClick={goBack}
                className="btn-sm"
                context="secondary"
                // color="white"
              >
                <span>Trở về</span>
              </Button> */}
              <Button
                className="btn-sm mr-2"
                // disabled={!id}
                width="80px"
                onClick={submit}
                color="blue"
              >
                <span>{id ? 'Lưu lại' : 'Cập nhật'}</span>
              </Button>
              {renderStatusButton({
                status: data?.status,
                publish_status: data?.publish_status,
              })}
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        name: data?.name || '',
        origin_supplier_price: data?.origin_supplier_price || 0,
        odii_price: data?.odii_price || 0,
        low_retail_price: data?.low_retail_price || 0,
        number_of_visits: data?.number_of_visits || '',
        number_of_booking: data?.number_of_booking || '',
        number_of_vote: data?.number_of_vote || '',
        rating: data?.rating || '',
        odii_compare_price: data?.odii_compare_price || 0,
        high_retail_price: data?.high_retail_price || 0,
        sku: data?.sku || '',
        barcode: data?.barcode || '',
        description: data?.description || '',
        total_quantity: data?.total_quantity || '',
        short_description: data?.short_description || '',
        defaultVariation: data?.variations?.[0] || { box_length_cm: '' },
        thumb: data?.thumb || null,
        currency_code: data?.currency_code,
        product_images: data?.product_images || [],
        tags: data?.tags || [],
        // status: data?.status,
        option_1: data?.option_1,
        option_2: data?.option_2,
        option_3: data?.option_3,
        supplier_warehousing: data?.supplier_warehousing?.id,
        vendor: data?.vendor || '',
        categories: data?.categories || [],
        has_variation: data?.has_variation,
        // variations: data?.variations,
      });
      setVariations(data?.variations || []);
      dataBreadcrumb.title = data?.name;
      // dataBreadcrumb.status = data?.status;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  // const goBack = () => {
  //   history.push('/products');
  // };

  const submitWithStatus = values => () => {
    // if (isEmpty(allStatus)) {
    setAllStatus(values);
    // } else {
    //   submit();
    // }
  };

  const renderStatusButton = ({ status, publish_status }) => {
    let element;
    switch (true) {
      case status === 'inactive' && publish_status === 'pending_for_review':
        element = (
          <>
            <Button
              className="btn-sm mr-2 "
              // disabled={!id}
              width="80px"
              onClick={submitWithStatus({
                status: 'active',
                publish_status: 'active',
              })}
              color="blue"
            >
              <span>Duyệt</span>
            </Button>
            <Button
              className="btn-sm mr-2 "
              // disabled={!id}
              width="100px"
              onClick={submitWithStatus({
                status: 'inactive',
                publish_status: 'rejected',
              })}
              color="red"
            >
              <span>Từ chối</span>
            </Button>
          </>
        );
        break;

      case status === 'active' && publish_status === 'active':
        element = (
          <Button
            className="btn-sm mr-2 "
            // disabled={!id}
            width="100px"
            onClick={submitWithStatus({
              status: 'inactive',
            })}
            color="red"
          >
            <span>Dừng bán</span>
          </Button>
        );
        break;
      case status === 'inactive' && publish_status === 'active':
        element = (
          <Button
            className="btn-sm mr-2 "
            // disabled={!id}
            width="100px"
            onClick={submitWithStatus({
              status: 'active',
            })}
            color="green"
          >
            <span>Hoạt Động</span>
          </Button>
        );
        break;
      default:
        break;
    }
    return element;
  };

  const onClear = () => {
    if (id) {
      setFieldsValue({
        ...data,
        supplier_warehousing: data?.supplier_warehousing?.id,
      });
    } else {
      resetFields({});
    }
  };

  const onFinishFailed = ({ errorFields }) => {
    let descriptionErr = '';
    for (const iterator of errorFields) {
      descriptionErr = `${
        descriptionErr ? `${descriptionErr},` : descriptionErr
      }
      ${iterator.errors[0]}   
        `;
    }
    message.error(descriptionErr);
  };

  const onFinish = values => {
    // if (!isFieldsTouched(id ? ['name'] : ['name'])) {
    //   return message.error('Vui lòng thêm thông tin!');
    // }
    const { defaultVariation, ...resValues } = values;
    const { publish_status, status } = allStatus;

    const finalVariations = has_variation
      ? variations
      : [
          {
            ...(variations?.[0] || {}),
            is_default: true,
            ...defaultVariation,
          },
        ];
    const handleVariations = finalVariations.map(item =>
      pickBy(item, identity),
    );
    const dataSend = {
      ...resValues,
      name: resValues.name?.trim(),
      variations: handleVariations,
      status: status || data.status,
      publish_status: publish_status || data.publish_status,
      product_images_ids: resValues.product_images.map(item =>
        item.id.toString(),
      ),
    };
    const handleDataSend = pickBy(dataSend, identity);
    if (id) {
      dispatch(
        actions.update({
          id,
          data: {
            // ...data,
            has_variation: !!resValues.resValues,
            ...handleDataSend,
          },
        }),
      );
    } else {
      dispatch(
        actions.create({
          ...handleDataSend,
        }),
      );
    }
  };

  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onValuesChange={setFormValues}
          // initialValues={{
          //   name: data?.name || '',
          //   odii_price: data?.odii_price || 0,
          // }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <>
            <Row gutter={24}>
              <Col span={18}>
                <CustomSectionWrapper mt={{ xs: 's4' }}>
                  <div className="title">Tiêu đề</div>
                  <div className="">
                    <Item
                      name="name"
                      label=""
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your name!',
                        },
                      ]}
                    >
                      <Input disabled placeholder="name" />
                    </Item>
                  </div>
                </CustomSectionWrapper>

                <Description layout={layout} form={form} />
                <SortDescription layout={layout} />
                <ProductImages layout={layout} />

                <Price layout={layout} />
                <Counting layout={layout} />
                <Info layout={layout} />
                <CustomSectionWrapper mt={{ xs: 's4' }}>
                  <div className="title">Varriant</div>
                  <div className="">
                    <Item
                      name="has_variation"
                      valuePropName="checked"
                      label=""
                      {...layout}
                    >
                      <Checkbox disabled>{`Sản phẩm này ${
                        has_variation ? '' : 'không'
                      } có Variant`}</Checkbox>
                    </Item>
                  </div>
                  {!has_variation && (
                    <Options
                      layout={layout}
                      variations={variations}
                      setVariations={setVariations}
                    />
                  )}
                </CustomSectionWrapper>
                {has_variation ? (
                  <ListVariations
                    layout={layout}
                    setVariations={setVariations}
                    form={form}
                    variations={variations}
                  />
                ) : (
                  <Shipping
                    layout={layout}
                    form={form}
                    defaultVariation={variations?.[0] || {}}
                  />
                )}
              </Col>
              <Col span={6}>
                {/* <Status layout={layout} /> */}
                <CustomSectionWrapper mt={{ xs: 's4' }}>
                  <div className="title">Trạng thái</div>
                  <CustomStyle
                    mb={{ xs: 's6' }}
                    fontSize={{ xs: 'f3' }}
                    fontWeight="bold"
                    color={
                      COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                        ?.color
                    }
                  >
                    {COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                      ?.label ?? <span>&nbsp;</span>}
                  </CustomStyle>
                </CustomSectionWrapper>
                <AvatarProduct layout={layout} />
                <Vendor layout={layout} />
                <CustomSectionWrapper mt={{ xs: 's4' }}>
                  <div className="title">Danh mục</div>
                  <CustomStyle
                    color="darkBlue3"
                    fontWeight="bold"
                    mb={{ xs: 's6' }}
                  >
                    {!isEmpty(data?.product_categories_metadata)
                      ? data?.product_categories_metadata.map((item, i) => (
                          <span key={item.id}>
                            {i === 0 ? '' : ' / '}
                            {item.name}
                          </span>
                        ))
                      : 'Sản phẩm này không có danh mục!'}
                  </CustomStyle>
                </CustomSectionWrapper>
                {/* <CategoryProduct layout={layout} form={form} /> */}
                <Supplier supplier={data?.supplier || {}} />
                <WareHousing data={data} />
                <Tags layout={layout} />
              </Col>
            </Row>
            <Item shouldUpdate {...tailLayout}>
              <Space>
                <Button
                  // onClick={onMenuClick(null, 2)}
                  type="primary"
                  htmlType="submit"
                  className="btn-sm mr-2"
                  // disabled={!id}
                  color="blue"
                >
                  <span>{id ? 'Lưu lại' : 'Cập nhật'}</span>
                </Button>
                <Button
                  context="secondary"
                  color="default"
                  onClick={onClear}
                  className="btn-sm"
                >
                  <span>Hủy bỏ</span>
                </Button>
              </Space>
            </Item>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}
