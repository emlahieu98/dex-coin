import React, { useState, useEffect } from 'react';
import { formatVND } from 'utils/helpers';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber } from 'lodash';
import { Modal, Button, Image } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { CustomInputNumber } from '../styled';

export default function EditPrice({
  layout,
  data = [],
  variations = [],
  setVariations,
  callBackCancel,
  ...res
}) {
  const [allPriceOdii, setAllPriceOdii] = useState('');
  const [allOdiiComparePrice, setAllOdiiComparePrice] = useState('');
  const [listShow, setListShow] = useState(data);
  const [finalListVariation, setFinalListVariation] = useState(variations);
  const [disableOk, setDisableOk] = useState(true);

  const onSave = () => {
    setVariations(finalListVariation);
    callBackCancel();
  };

  useEffect(() => {
    if (isEqual(data, listShow)) {
      setDisableOk(true);
    } else setDisableOk(false);
  }, [listShow]);

  const handleChangeOdiiPrice = price => {
    if (isNumber(price)) {
      setAllPriceOdii(price);
    } else {
      setAllPriceOdii('');
    }
  };

  const handleChangeAllOdiiComparePrice = price => {
    if (isNumber(price)) {
      setAllOdiiComparePrice(price);
    } else {
      setAllOdiiComparePrice(price);
    }
  };

  const applyAllPrice = type => () => {
    const price = type === 'odii_price' ? allPriceOdii : allOdiiComparePrice;
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [type]: listShow.some(o => o.id === item.id) ? price : item[type],
    }));
    const handleListShow = listShow.map(item => ({
      ...item,
      [type]: price,
    }));
    setFinalListVariation(handleVariations);
    setListShow(handleListShow);
  };

  const applyPrice = (type, id) => price => {
    if (isNumber(price)) {
      const handleVariations = finalListVariation.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
      }));
      const handleListShow = listShow.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
      }));
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }
  };

  return (
    <div>
      <Modal
        {...res}
        disableOk={disableOk}
        width={600}
        callBackOk={onSave}
        callBackCancel={callBackCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả giá Odii
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <CustomInputNumber
                  placeholder="Giá"
                  value={allPriceOdii}
                  onChange={handleChangeOdiiPrice}
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allPriceOdii)}
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice('odii_price')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả giá khuyễn mại
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <CustomInputNumber
                  placeholder="Giá"
                  value={allOdiiComparePrice}
                  onChange={handleChangeAllOdiiComparePrice}
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allOdiiComparePrice)}
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice('odii_compare_price')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider />

        <WrapperOption>
          {listShow.map(item => (
            <Row gutter={8}>
              <Col span={10}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image size="200x200" src={item?.thumb?.location} />
                    }
                    description={`Giá NCC: ${formatVND(
                      item.origin_supplier_price,
                    )}đ`}
                    title={`${item.option_1}${
                      item.option_2 ? `/${item.option_2}` : ''
                    }${item.option_3 ? `/${item.option_3}` : ''}`}
                  />
                </List.Item>
              </Col>
              <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>Giá Odii</CustomStyle>
                <CustomInputNumber
                  placeholder="Giá"
                  value={item.odii_price}
                  onChange={applyPrice('odii_price', item.id)}
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                />
              </Col>
              <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>Giá khuyến mại</CustomStyle>
                <CustomInputNumber
                  placeholder="Giá"
                  value={item.odii_compare_price}
                  onChange={applyPrice('odii_compare_price', item.id)}
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                />
              </Col>
            </Row>
          ))}
        </WrapperOption>
      </Modal>
    </div>
  );
}

const WrapperOption = styled.div`
  max-height: 300px;
  overflow: scroll;
  > :not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.stroke};
  }
  .ant-image {
    width: 48px;
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
