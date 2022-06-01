import React, { useState, useRef, useEffect, memo } from 'react';
import { isEmpty, debounce } from 'lodash';

import { transparent } from 'assets/images';
import DeleteButton from 'assets/images/delete-button.svg';

import { fabric } from 'fabric';

import styled from 'styled-components/macro';
import AddLayer from './AddLayer';
import ListLayer from './ListLayer';
import { genImgUrl } from 'utils/helpers';

fabric.Object.prototype.set({
  borderColor: '#1890ff',
  borderDashArray: [4],
  cornerColor: '#1890ff',
  cornerStyle: 'circle',
});

const DESIGN_PREVIEW_WIDTH = 500;
const DESIGN_PREVIEW_HEIGHT = 500;

const LAYER_TYPES_FILE = 'File';
const LAYER_TYPES_TEXT = 'Text';

export default memo(function DesignTool({
  setLoading,
  setValid,
  design,
  setActionRefs,
}) {
  // console.log('Render design tool');
  const [fabricCanvas, setfabricCanvas] = useState(null);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [layers, setLayers] = useState([]);
  const canvasRef = useRef(null);
  const btnDeleteRef = useRef(null);

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    setLayers(design?.layers);
  }, [design]);

  useEffect(() => {
    loadDefaultLayers();
  }, [design, fabricCanvas]);

  const loadDefaultLayers = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
    }
    if (fabricCanvas && design?.layers?.length) {
      setLoading(true);
      setTimeout(() => {
        // setTimout fix block modal animation
        fabricCanvas.loadFromJSON({ objects: design.layers }, () =>
          setLoading(false),
        );
      }, 300);
    }
  };

  const initActionsRefs = () => {
    setActionRefs({
      getCanvas: () => {
        return canvasRef.current;
      },
      getLayers: () => {
        return layers;
      },
      focusOut: () => {
        setActiveLayerId(null);
        fabricCanvas.discardActiveObject().renderAll();
      },
    });
  };

  useEffect(() => {
    initCanvasEvents();
    initActionsRefs();
    updateBtnDeletePosition();
  }, [activeLayerId, layers, fabricCanvas]);

  const debounceBasicUpdate = debounce(() => {
    updateBtnDeletePosition();
    updateLayers();
  }, 300);

  const debounceSelected = debounce(e => {
    updateBtnDeletePosition();
    onLayerSelected(e);
  }, 300);

  const initCanvasEvents = () => {
    if (!fabricCanvas) {
      return;
    }

    fabricCanvas.off('object:added');
    fabricCanvas.off('object:removed');
    fabricCanvas.off('object:moving');
    fabricCanvas.off('object:moved');
    fabricCanvas.off('object:scaling');
    fabricCanvas.off('object:rotating');
    fabricCanvas.off('object:scaled');
    fabricCanvas.off('object:rotated');
    fabricCanvas.off('selection:created');
    fabricCanvas.off('selection:updated');
    fabricCanvas.off('selection:cleared');

    fabricCanvas.on('object:added', updateLayers);
    fabricCanvas.on('object:removed', updateLayers);
    fabricCanvas.on('object:moving', disableBtnDelete);
    fabricCanvas.on('object:moved', debounceBasicUpdate);
    fabricCanvas.on('object:scaling', disableBtnDelete);
    fabricCanvas.on('object:rotating', disableBtnDelete);
    fabricCanvas.on('object:scaled', debounceBasicUpdate);
    fabricCanvas.on('object:rotated', debounceBasicUpdate);
    fabricCanvas.on('selection:created', onLayerSelected);
    fabricCanvas.on('selection:updated', e => {
      debounceSelected(e);
    });
    fabricCanvas.on('selection:cleared', onLayerUnselected);
  };

  const initCanvas = () => {
    const _canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: false,
    });
    _canvas.setWidth(DESIGN_PREVIEW_WIDTH);
    _canvas.setHeight(DESIGN_PREVIEW_HEIGHT);

    _canvas.renderAll();
    setfabricCanvas(_canvas);
  };

  const addLayerEvents = layer => {
    // layer.on('mousedown', () => {
    //   this.showCanvasLabel = true;
    // });
    // layer.on('mouseup', () => {
    //   this.showCanvasLabel = false;
    // });
  };

  const onLayerSelected = ({ selected }) => {
    const _activeLayerId = selected[0].id;
    setActiveLayerId(_activeLayerId);
  };

  const setSelectedLayer = layerId => {
    const selectedLayer = fabricCanvas._objects.find(
      layer => layer.id === layerId,
    );
    if (selectedLayer) {
      fabricCanvas.setActiveObject(selectedLayer);
      fabricCanvas.renderAll();
    }
  };

  const reOrderLayer = ({ sourceId, targetId }) => {
    const _objects = fabricCanvas._objects;
    const sourceIndex = _objects.findIndex(object => object.id === sourceId);
    const targetIndex = _objects.findIndex(object => object.id === targetId);
    const source = _objects[sourceIndex];
    source.moveTo(targetIndex);
    updateLayers();
  };

  const alignLayer = type => {
    const currLayer = fabricCanvas.getActiveObject();
    const width = currLayer.width * currLayer.scaleX;
    const height = currLayer.height * currLayer.scaleY;
    switch (type) {
      case 'CENTER_H':
        currLayer.left = DESIGN_PREVIEW_WIDTH / 2;
        break;
      case 'CENTER_V':
        currLayer.top = DESIGN_PREVIEW_HEIGHT / 2;
        break;
      case 'LEFT':
        currLayer.left = width / 2;
        break;
      case 'RIGHT':
        currLayer.left = DESIGN_PREVIEW_WIDTH - width / 2;
        break;
      case 'TOP':
        currLayer.top = height / 2;
        break;
      case 'BOTTOM':
        currLayer.top = DESIGN_PREVIEW_HEIGHT - height / 2;
        break;
      default:
        break;
    }
    setTimeout(() => {
      updateBtnDeletePosition();
      updateLayers();
    });
  };

  const rotateLayer = data => {
    fabricCanvas.getActiveObject().angle = data;
    fabricCanvas.renderAll();
    updateBtnDeletePosition();
    updateLayers();
  };

  const onLayerUnselected = () => {
    setActiveLayerId(null);
  };

  const updateLayers = () => {
    // console.log('---------update layer');
    const layers = fabricCanvas.toJSON([
      'id',
      'layerType',
      'resourceId',
      'resourcePath',
      'resourceName',
    ]).objects;
    setLayers(layers);
  };

  const emitAction = ({ type, data }) => {
    switch (type) {
      case 'ADD_BG':
        addImage(data, true);
        break;
      case 'ADD_IMAGE':
        addImage(data);
        break;
      case 'ADD_TEXT':
        addText();
        break;
      case 'SET_SELECTED':
        setSelectedLayer(data);
        break;
      case 'DELETE':
        deleteLayer(data);
        break;
      case 'RE_ORDER':
        reOrderLayer(data);
        break;
      case 'ALIGN':
        alignLayer(data);
        break;
      case 'ROTATE':
        rotateLayer(data);
        break;
      default:
        break;
    }
  };

  const updateValid = () => {
    setValid(fabricCanvas && fabricCanvas._objects.length > 0);
  };

  const centerLayer = layer => {
    fabricCanvas.centerObject(layer);
  };

  const disableBtnDelete = () => {
    const btnDeleteElement = btnDeleteRef.current;
    btnDeleteElement.style.display = 'none';
  };

  const updateBtnDeletePosition = () => {
    if (!fabricCanvas) {
      return;
    }
    const activeLayer = fabricCanvas.getActiveObject();
    const btnDeleteElement = btnDeleteRef.current;
    if (isEmpty(activeLayer)) {
      disableBtnDelete();
      return;
    }

    const top = `${activeLayer.getCoords()[1].y - 10}px`;
    const left = `${activeLayer.getCoords()[1].x - 10}px`;
    const style = {
      display: 'block',
      top,
      left,
    };

    for (let styleAttr in style) {
      btnDeleteElement.style[styleAttr] = style[styleAttr];
    }
  };

  const deleteLayer = id => {
    const layer =
      id === undefined
        ? fabricCanvas.getActiveObject()
        : fabricCanvas._objects.find(l => l.id === id);
    fabricCanvas.remove(layer);
    updateValid();
  };

  const setLayerBasic = layer => {
    layer.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: true,
      br: true,
      tl: true,
      tr: true,
      // mtr: false,
    });
  };

  const addImage = (file, isBackground) => {
    setLoading(true);
    fabric.Image.fromURL(
      genImgUrl({ location: file.location, width: 0, height: 0 }),
      img => {
        img.set({
          id: new Date().getTime(),
          layerType: LAYER_TYPES_FILE,
          resourceId: file.id,
          resourcePath: file.location,
          resourceName: (isBackground ? 'Background_' : 'Layer_') + file.name,
          originX: 'center',
          originY: 'center',
          globalCompositeOperation: 'source-over',
        });
        setLayerBasic(img);
        if (isBackground) {
          const scaleWidth = DESIGN_PREVIEW_WIDTH / img.width;
          const scaleHeight = DESIGN_PREVIEW_HEIGHT / img.height;
          const scaleRate = scaleWidth > scaleHeight ? scaleWidth : scaleHeight;
          img.scaleToWidth(img.width * scaleRate);
          img.globalCompositeOperation = 'destination-over';
        } else {
          img.scaleToWidth(DESIGN_PREVIEW_WIDTH / 2);
        }

        img.setCoords();
        addLayerEvents(img);
        centerLayer(img);
        fabricCanvas.add(img);
        if (isBackground) {
          // fabricCanvas.setBackgroundImage(img);
          fabricCanvas.sendToBack(img);
        } else {
          fabricCanvas.setActiveObject(img);
        }
        updateValid();
        setLoading(false);
      },
      { crossOrigin: 'anonymous' },
    );
  };

  const addText = () => {
    setLoading(true);
    const text = new fabric.Text('Odii', {
      id: new Date().getTime(),
      layerType: LAYER_TYPES_TEXT,
      fill: '#000',
      originX: 'center',
      originY: 'center',
      angle: 0,
      fontFamily: 'Roboto',
      shadow: '#000',
    });
    centerLayer(text);
    fabricCanvas.add(text);
    updateValid();
    setLoading(false);
  };

  return (
    <DesignToolWrapper>
      <div className="preview-area-wrapper">
        <canvas ref={canvasRef}></canvas>
        <span
          className="canvas-delete-button"
          ref={btnDeleteRef}
          onClick={() => deleteLayer()}
        ></span>
      </div>
      <div className="sidebar">
        <AddLayer emitAction={emitAction} setLoading={setLoading}></AddLayer>
        <ListLayer
          layers={layers}
          activeLayerId={activeLayerId}
          setLoading={setLoading}
          emitAction={emitAction}
          className="list-layer-wrapper"
        ></ListLayer>
      </div>
    </DesignToolWrapper>
  );
});

export const DesignToolWrapper = styled.div`
  display: flex;
  .canvas-delete-button {
    position: absolute;
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-size: 10px;
    background-color: #f34536;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 1003;
    background-image: url('${DeleteButton}');
    display: none;
  }
  .preview-area-wrapper {
    position: relative;
    width: 500px;
    height: 500px;
    /* border: 1px solid #d7d7d7; */
    display: flex;
    justify-content: center;
    align-items: center;
    color: #acacac;
    flex-grow: 1;
    flex-shrink: 0;
    background: repeat url('${transparent}');
  }
  .list-layer-wrapper {
    margin-top: 30px;
  }
  .sidebar {
    flex-shrink: 0;
    flex-grow: 1;
    margin-left: 25px;
    width: calc(100% - 500px - 25px);
  }
`;
