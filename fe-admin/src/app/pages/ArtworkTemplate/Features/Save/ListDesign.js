import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button, PageWrapper } from 'app/components';
import { Row, Col, Spin, Form as F, Card } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import { globalActions } from 'app/pages/AppPrivate/slice';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useArtWorkTemplateSlice } from '../../slice';
import styled from 'styled-components';
import { genImgUrl } from 'utils/helpers';
import { isEmpty } from 'lodash';
import { transparent } from 'assets/images';
import DesignInfo from '../../Components/DesignInfo';

export function ListDesign({ history }) {
  const { id } = useParams();
  const isPageUpdate = id && true;
  const isLoading = useSelector(selectLoading);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [currDesign, setCurrDesign] = useState({});
  const [isUpdateDesign, setUpdateDesign] = useState(false);
  let data = useSelector(selectDetail) || {};
  const { actions } = useArtWorkTemplateSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: `Artwork template`,
          link: `/artwork-templates/uc/${id}`,
        },
        {
          name: 'Designs',
        },
      ],
      fixWidth: true,
      title: `${data?.name || 'Design template'}`,
      actions: (
        <PageActionWrapper>
          <F.Item className="m-0" shouldUpdate>
            <div className="d-flex justify-content-between">
              <Button
                className="btn-sm page-action"
                type="primary"
                onClick={handleSaveDesign}
              >
                <PlusCircleOutlined />
                <span className="page-action__title">Thêm design</span>
              </Button>
            </div>
          </F.Item>
        </PageActionWrapper>
      ),
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, [data]);

  const getData = () => {
    if (isPageUpdate) {
      dispatch(actions.getDetail(id));
    }
  };

  const onFinishSave = () => {
    setVisibleModal(false);
    getData();
  };

  const handleSaveDesign = ({ design }) => {
    if (design) {
      setCurrDesign(design);
      setUpdateDesign(true);
    } else {
      setCurrDesign({});
      setUpdateDesign(false);
    }
    setVisibleModal(true);
  };

  const sortedLayers = useMemo(() => {
    return data && data.designs
      ? [...data.designs].sort((e1, e2) => e2.id - e1.id)
      : [];
  }, [data]);

  return (
    <PageWrapperDefault>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Card className="page-card">
          <div className="design-items">
            {!isLoading && isEmpty(sortedLayers) ? (
              <div className="layer-empty-title">Danh sách layer trống!</div>
            ) : (
              sortedLayers?.map(design => (
                <div
                  key={design?.id}
                  className="design-item"
                  onClick={() => handleSaveDesign({ design })}
                >
                  <div className="design__thumbnail">
                    <img
                      alt="design"
                      className="thumbnail-img"
                      src={genImgUrl({ location: design?.thumb?.location })}
                    />
                  </div>
                  <div className="design__name">{design?.name}</div>
                </div>
              ))
            )}
          </div>
        </Card>
        <DesignInfo
          template={data}
          isVisible={isVisibleModal}
          setVisible={setVisibleModal}
          design={currDesign}
          isUpdateDesign={isUpdateDesign}
          onFinish={onFinishSave}
        ></DesignInfo>
      </Spin>
    </PageWrapperDefault>
  );
}

const PageActionWrapper = styled.div`
  .page-action {
    display: inline-flex;
    align-items: center;
    background-color: #4869de;
    border-color: #4869de;
  }
  .page-action__title {
    margin-left: 8px;
  }
`;

const PageWrapperDefault = styled(PageWrapper)`
  .layer-empty-title {
    width: 100%;
    text-align: center;
    color: gray;
  }
  .page-card {
    min-height: 80vh;
  }
  .design-items {
    display: flex;
    flex-wrap: wrap;
  }
  .design-items {
    width: 250px;
    margin: 0 auto;
  }
  .design-item {
    flex: 0 0 100%;
    margin: 15px;
    padding: 0 0 10px 0;
    box-sizing: border-box;
  }
  .design__thumbnail {
    background: url('${transparent}');
    height: 245px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: 768px) {
    .design-items {
      width: 500px;
      margin: 0 auto;
    }
    .design-item {
      flex: 0 0 calc(50% - 30px);
      margin: 15px;
      box-sizing: border-box;
    }
    .design__thumbnail {
      height: 215px;
    }
  }
  @media (min-width: 1100px) {
    .design-items {
      width: 768px;
      margin: 0 auto;
    }
    .design-item {
      flex: 0 0 calc(33.33% - 30px);
      margin: 15px;
      box-sizing: border-box;
    }
    .design__thumbnail {
      height: 220px;
    }
  }

  @media (min-width: 1500px) {
    .design-items {
      width: 1024px;
      margin: 0 auto;
    }
    .design-item {
      flex: 0 0 calc(25% - 30px);
      margin: 15px;
      box-sizing: border-box;
    }
    .design__thumbnail {
      height: 220px;
    }
  }
  .design-item {
    & > div {
      padding: 2px 10px 0 10px;
    }
    border: 1px solid #e8e8e8;
    .thumbnail-img {
      max-width: 100%;
      max-height: 100%;
      min-width: 70%;
      min-height: 70%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    cursor: pointer;
  }
  .design__name {
    border-top: 1px solid #e8e8e8;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
    font-size: 15px;
    font-weight: 500;
    padding-top: 5px !important;
  }
`;
