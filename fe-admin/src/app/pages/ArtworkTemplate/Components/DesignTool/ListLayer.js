import React, { useState, memo, useMemo, useRef, useEffect } from 'react';
import { Tooltip } from 'antd';
import {
  BorderBottomOutlined,
  BorderHorizontalOutlined,
  BorderVerticleOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';

import { debounce, isEmpty } from 'lodash';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default memo(function ListLayer({
  layers,
  activeLayerId,
  emitAction,
  ...props
}) {
  // console.log('Render list layer');

  const rotateInput = useRef(null);

  useEffect(() => {
    setRotate();
  }, [layers, activeLayerId]);

  const sortedLayer = useMemo(() => {
    if (isEmpty(layers)) {
      return [];
    }
    return [...layers].reverse();
  }, [layers]);

  const onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    emitAction({
      type: 'RE_ORDER',
      data: {
        sourceId: sortedLayer[source.index].id,
        targetId: sortedLayer[destination.index].id,
      },
    });
  };

  const emitDebounce = debounce(({ type, data }) => {
    emitAction({ type, data });
  }, 250);

  const getCurrLayer = () => {
    return sortedLayer.find(layer => layer.id === activeLayerId);
  };

  const changeRotate = ({ type }) => {
    let angle = 0;
    switch (type) {
      case 'MINUS':
        angle = parseInt(rotateInput.current.value) - 15;
        break;
      case 'PLUS':
        angle = parseInt(rotateInput.current.value) + 15;
        break;
      default:
        break;
    }

    angle = angle < 180 ? angle : angle - 360;
    rotateInput.current.value = angle;

    emitAction({
      type: 'ROTATE',
      data: angle,
    });
  };

  const setRotate = () => {
    let angle = 0;
    const currLayer = getCurrLayer();
    if (!currLayer || !rotateInput.current) {
      return;
    }
    angle = currLayer.angle;
    angle = angle < 180 ? angle : angle - 360;
    rotateInput.current.value = angle;
  };

  return (
    <ListLayerWrapper {...props}>
      <div className="layer-add__title">Layers</div>
      <div className="layers__content">
        {layers?.length ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list-layer">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sortedLayer.map((item, index) => (
                    <Draggable
                      draggableId={'' + item.id}
                      index={index}
                      key={item.id}
                      className="layer-item__draggable"
                    >
                      {provided => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`layer-item${
                            activeLayerId === item.id ? ' active' : ''
                          }`}
                          onClick={() => {
                            emitAction({
                              type: 'SET_SELECTED',
                              data: item.id,
                            });
                          }}
                        >
                          <div className="layer-info">
                            <div className="layer-info__thumb">
                              <div className="layer-thubnail">
                                {item.layerType === 'File' && (
                                  <img alt="img" src={item.src}></img>
                                )}
                                {item.layerType === 'Text' && (
                                  <i className="far fa-text"></i>
                                )}
                              </div>
                            </div>
                            <div className="layer-info__content">
                              <div className="layer-name">
                                {item.text || item.resourceName}
                              </div>
                            </div>
                            <div
                              className="layer-info__action"
                              onClick={() => {
                                emitAction({
                                  type: 'DELETE',
                                  data: item.id,
                                });
                              }}
                            >
                              <Tooltip placement="topRight" title="Delete">
                                <div className="layer-action">
                                  <i className="far fa-trash"></i>
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                          <div className="layer-tool">
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'CENTER_H',
                                });
                              }}
                            >
                              <Tooltip
                                placement="topRight"
                                title="Center horizontally"
                              >
                                <BorderHorizontalOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'CENTER_V',
                                });
                              }}
                            >
                              <Tooltip
                                placement="topRight"
                                title="Center vertically"
                              >
                                <BorderVerticleOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'LEFT',
                                });
                              }}
                            >
                              <Tooltip placement="topRight" title="Left">
                                <BorderLeftOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'RIGHT',
                                });
                              }}
                            >
                              <Tooltip placement="topRight" title="Right">
                                <BorderRightOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'TOP',
                                });
                              }}
                            >
                              <Tooltip placement="topRight" title="Top">
                                <BorderTopOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div
                              className="layer-tool__item"
                              onClick={() => {
                                emitAction({
                                  type: 'ALIGN',
                                  data: 'BOTTOM',
                                });
                              }}
                            >
                              <Tooltip placement="topRight" title="Bottom">
                                <BorderBottomOutlined className="tool-item__icon" />
                              </Tooltip>
                            </div>
                            <div className="layer-tool__item">
                              <div className="tool-rotate">
                                <Tooltip
                                  placement="topRight"
                                  title="Minus rotate angel"
                                >
                                  <MinusOutlined
                                    className="rotate-icon tool-item__icon"
                                    onClick={() =>
                                      changeRotate({ type: 'MINUS' })
                                    }
                                  />
                                </Tooltip>
                                <input
                                  type="number"
                                  {...(activeLayerId === item.id && {
                                    ref: rotateInput,
                                  })}
                                  className="rotate-input"
                                  onChange={e => {
                                    emitDebounce({
                                      type: 'ROTATE',
                                      data: e.target.value,
                                    });
                                  }}
                                />
                                <Tooltip
                                  placement="topRight"
                                  title="Plus rotate angel"
                                >
                                  <PlusOutlined
                                    className="rotate-icon tool-item__icon"
                                    onClick={() =>
                                      changeRotate({ type: 'PLUS' })
                                    }
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="empty">Please add a layer</div>
        )}
      </div>
    </ListLayerWrapper>
  );
});

export const ListLayerWrapper = styled.div`
  font-size: 14px;
  font-weight: bold;
  .empty {
    color: gray;
  }
  .layers__content {
    margin-top: 10px;
    overflow: auto;
    height: calc(100vh - 550px);
    scrollbar-width: thin;
    font-weight: normal;
    .layer-item {
      padding: 15px 0 15px 20px;
      border-left: 3px solid transparent;
      &:hover {
        border-color: #e3e3e3;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #ececec;
      }
      &.active {
        border-left-color: #1890ff;
        .layer-tool {
          display: flex;
        }
      }
    }
  }

  .layer-info {
    display: flex;
    .layer-info__content,
    .layer-info__action {
      margin-left: 20px;
    }
    .layer-info__content,
    .layer-info__action {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .layer-info__action {
      margin-left: auto;
    }
    .layer-name {
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -moz-box-orient: vertical;
      overflow: hidden;
    }
    .layer-thubnail {
      border-radius: 4px;
      width: 45px;
      height: 45px;
      border: 1px solid #e3e3e3;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .layer-action {
      cursor: pointer;
      color: #808080;
      border-radius: 4px;
      padding: 3px 9px;
      &:hover {
        background: #e3e3e3;
        color: #464646;
      }
      i {
        font-size: 13px;
      }
    }
  }
  .layer-tool {
    margin-top: 14px;
    display: none;
    .layer-tool__item:not(:first-child) {
      margin-left: 10px;
    }
    .tool-item__icon {
      transition: all ease-out 0.2s;
      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
      cursor: pointer;
      padding: 5px;
      font-size: 18px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
    }
    .rotate-icon {
      border: none;
    }
    .tool-rotate {
      border: 1px solid #d9d9d9;
      display: inline-flex;
      margin-left: 30px;
      input {
        outline: none;
        width: 65px;
        padding: 0 10px;
        border: 1px solid #d9d9d9;
        border-top: none;
        border-bottom: none;
      }
    }
  }
`;
