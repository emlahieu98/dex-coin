import React, { useState, useEffect, useRef } from 'react';
import CustomModal from 'app/components/Modal';
import { Tooltip, AutoComplete, Spin } from 'antd';
import Styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Radio, Input, Checkbox } from 'app/components';
import { isEmpty, cloneDeep } from 'lodash';
import notification from 'utils/notification';
import { getStoreCategories } from 'utils/providers';
import { RightOutlined } from '@ant-design/icons';
import { CustomStyle } from 'styles/commons';
import { useDebouncedCallback } from 'use-debounce';

export default function CategoriesModal({
  data = [],
  defaultSuggestValue,
  defaultActives = [],
  handleConfirm = () => null,
  ...res
}) {
  const [actives, setActives] = useState(defaultActives);
  const [suggestValues, setSuggestValues] = useState(defaultActives || []);
  const [draftSuggestValues, setDraftSuggestValues] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataChanel, setDataChanel] = useState([[], [], [], []]);
  const [options, setOptions] = useState([]);
  const input = useRef(null);
  const debounced = useDebouncedCallback(
    // function
    value => {
      if (value && value.length > 1) {
        setIsLoading(true);
        getStoreCategories({
          keyword: value,
          platform: 'shopee',
          page_size: 100,
        })
          .then(response => {
            console.log(`response`, response);
            setIsLoading(false);
            if (!isEmpty(response?.data))
              setOptions(
                response?.data.map(v => ({ ...v, value: v.display_path })),
              );
          })
          .catch(err => setIsLoading(false));
      } else {
        setSuggestValues([]);
        setOptions([]);
      }
    },
    // delay in ms
    500,
  );
  useEffect(() => {
    if (isEmpty(data)) return;
    // if (input?.current) {
    //   setTimeout(() => input?.current.focus(), 1000);
    //   // input?.current?.focus();
    // }
    if (defaultSuggestValue) {
      setOptions(defaultActives);
      setSuggestValues(defaultSuggestValue);
      setDataChanel([data]);
    } else {
      // let newData = dataChanel.slice(0);
      // if (isEmpty(defaultActives)) {
      //   newData[0] = data;
      // } else {
      //   defaultActives.forEach((_, key) => {
      //     if (key === 0) {
      //       newData[key] = data;
      //     } else {
      //       newData[key] = newData[key - 1]?.find(
      //         v => v.name === defaultActives[key - 1].name,
      //       ).children;
      //     }
      //   });
      // }
      // setDataChanel(newData);
    }
  }, []);

  const onChangeRadius = index => e => {
    const preActives = actives.slice(0, index);
    const name = e.target.value;
    const currentValue = dataChanel[index].find(item => item.name === name);
    const newActives = [...preActives, currentValue];
    let newData = [];
    if (!isEmpty(currentValue.children)) {
      const cloneDataChanel = dataChanel.slice(0);
      if (+index + 1 === dataChanel.length) {
        // newData.push([]);
        cloneDataChanel[+index + 1] = [];
      }
      for (let [i, item] of cloneDataChanel.entries()) {
        if (i <= index) {
          newData[i] = item;
        } else if (i === index + 1) {
          newData[i] = currentValue.children
            .slice()
            .sort((a, b) => (a.priority > b.priority ? 1 : -1));
        } else newData[i] = [];
      }

      setDataChanel(newData);
    } else {
      for (let [i, item] of dataChanel.entries()) {
        if (i <= index) {
          newData[i] = item;
          // } else if (i === index + 1) {
          //   newData[i] = currentValue.children;
        } else newData[i] = [];
      }
    }
    setDataChanel(newData);

    setActives(newActives);
  };

  const handleOk = () => {
    handleConfirm(
      // suggestValues ? options.filter(v => v.id === suggestValues) : actives,
      suggestValues ? suggestValues : actives,
    );
  };

  const onSearch = searchText => {
    setDraftSuggestValues(searchText);
    debounced(searchText);
  };

  const deleteItem = id => () => {
    // const index = suggestValues.findIndex(v => v.id == id);
    // const cloneList = cloneDeep(suggestValues);
    // const newValue = cloneList.splice(index, 1);
    setSuggestValues(suggestValues.filter(item => item.id !== id));
  };

  const onSelect = display_path => {
    setDraftSuggestValues('');
    const current = options.find(v => v.display_path === display_path);
    console.log(`data12`, options, suggestValues, current);
    console.log(`data13`, display_path);

    if (suggestValues.some(v => v.id === current.id)) {
      notification(
        'error',
        'Bạn đã chọn danh mục này rồi',
        'không thành công!',
      );
      return;
    }
    setSuggestValues([...suggestValues, current]);
  };
  console.log(`data11`, suggestValues);

  const disableOk = isEmpty(actives) || !isEmpty(actives.slice(-1)[0].children);
  return (
    <CustomModal
      {...res}
      width={1000}
      bodyStyle={{ overflow: 'scroll' }}
      title="Danh mục sản phẩm"
      callBackOk={handleOk}
      disableOk={disableOk && isEmpty(suggestValues)}
    >
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomStyle color="grayBlue" mb={{ xs: 's2' }}>
          Đã chọn:
        </CustomStyle>
        <CustomStyle className="d-flex" mb={{ xs: 's4' }}>
          <SelectedList>
            {isEmpty(suggestValues) ||
              suggestValues.map(v => (
                <CustomStyle>
                  {v?.display_path || v}{' '}
                  <CloseOutlined
                    onClick={deleteItem(v.id)}
                    style={{ paddingLeft: 5, color: '#EE496B' }}
                  />
                </CustomStyle>
              ))}
          </SelectedList>
        </CustomStyle>
        <CustomStyle className="d-flex" mb={{ xs: 's4' }}>
          <AutoComplete
            ref={input}
            autoFocus
            // className="custom"
            value={draftSuggestValues || ''}
            style={{ width: '100%' }}
            onSelect={onSelect}
            onSearch={onSearch}
            options={options}
            // onKeyPress={handleKeyPress}
            // onChange={onChange}
          >
            <Input placeholder="Tìm kiếm ngành hàng" />
          </AutoComplete>
        </CustomStyle>
        {/* <Wrapper total={dataChanel.length}>
          {dataChanel.map((item, index) => (
            <Col>
              <Radio.Group
                onChange={onChangeRadius(index)}
                value={actives?.[index]?.name}
                disabled={!isEmpty(suggestValues)}
              >
                {item.map(v => (
                  <Radio value={v.name}>
                    <div className="d-flex justify-content-between align-items-center content">
                      <span className="text">
                        <Tooltip mouseEnterDelay={0.5} title={v.name}>
                          {v.name}
                        </Tooltip>
                      </span>
                      {isEmpty(v.children) || <RightOutlined />}
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Col>
          ))}
        </Wrapper> */}
      </Spin>
    </CustomModal>
  );
}

const SelectedList = Styled.div`
display: flex;
flex-wrap: wrap;
> * {
  display: flex;
    align-items: center;
  color: ${({ theme }) => theme.primary};
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.stroke};
  margin: 0 5px 5px 0;
}
`;

const Wrapper = Styled.div`
border: 1px solid ${({ theme }) => theme.stroke};
background: ${({ theme }) => theme.whitePrimary};
border-radius: 4px;
/* padding: 0 12px; */
width: calc(238px * ${({ total }) => total});
display: flex;
/* overflow-x: scroll; */
height: 410px;

`;

const Col = Styled.div`
display: inline-block;
overflow: auto;
white-space: nowrap;
height: 410px;
width: 230px;
.ant-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
    > * {
      padding: 8px;
    
      width: 100%;
      margin: 0;
      &.ant-radio-wrapper-checked {
        background: #EBF1FF;
      }
      > span:last-child {
        width: 197px;
        padding-right: 0;
      }
      .content {
        .text {
          white-space: nowrap; 
          padding-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis; 
        }
        .anticon {
          font-size: 10px;
        }
      }
    }
  }
  :not(:last-child){
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }
`;
