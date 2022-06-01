import React, { memo, useState, useRef, useEffect } from 'react';
import { Tag, Tooltip, Input } from 'antd';
import styled from 'styled-components';
import { isEmpty, isEqual } from 'lodash';
// import { Input } from 'app/components';
import { PlusOutlined } from '@ant-design/icons';

export default memo(function TagsCustom({
  disabled,
  data,
  onChange,
  defaultShowInput,
}) {
  const [state, setState] = useState({
    tags: data || [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  });

  useEffect(() => {
    if (!isEmpty(data) && !isEqual(data, state.tags)) setState({ tags: data });
  }, [data]);

  useEffect(() => {
    if (state.tags && onChange) onChange(state.tags);
  }, [state.tags]);

  const editInput = useRef(null);
  const input = useRef(null);

  const handleClose = removedTag => {
    const tags = state.tags.filter(tag => tag !== removedTag);
    setState({ ...state, tags });
  };

  const showInput = () => {
    setState({ ...state, inputVisible: true });
    setTimeout(() => input?.current.focus());
  };

  const handleInputChange = e => {
    setState({ ...state, inputValue: e.target.value });
  };

  const handleInputConfirm = e => {
    e.preventDefault();
    const { inputValue } = state;
    let { tags } = state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    setState({ ...state, tags, inputVisible: false, inputValue: '' });
  };

  const handleEditInputConfirm = () => {
    setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  const handleEditInputChange = e => {
    setState({ ...state, editInputValue: e.target.value });
  };

  const {
    tags,
    inputVisible,
    inputValue,
    editInputIndex,
    editInputValue,
  } = state;

  return (
    <Wrapper>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInput}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            disabled={disabled}
            // closable={index !== 0}
            closable={!disabled}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={e => {
                if (index !== 0) {
                  setState({
                    ...state,
                    editInputIndex: index,
                    editInputValue: tag,
                  });
                  e.preventDefault();
                  setTimeout(() => editInput?.current.focus());
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {(inputVisible || (defaultShowInput && !disabled)) && (
        <Input
          ref={input}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {defaultShowInput ||
        (!disabled && !inputVisible && (
          <Tag className="site-tag-plus" onClick={showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        ))}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  .site-tag-plus {
    background: #fff;
    border-style: dashed;
  }
  .edit-tag {
    user-select: none;
  }
  .tag-input {
    width: 78px;
    margin-right: 8px;
    margin-bottom: 5px;
    vertical-align: top;
  }
  [data-theme='dark'] .site-tag-plus {
    background: transparent;
    border-style: dashed;
  }
`;
