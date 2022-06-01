import React, { useState, useEffect, memo } from 'react';
import { Spin, Steps, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Button, PageWrapper } from 'app/components';
import InfoBasic from './InfoBasic';
import DesignTool from '../../Components/DesignTool';

import request, { uploadImage } from 'utils/request';
import notification from 'utils/notification';

import styled from 'styled-components/macro';

const loadingIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

const { Step } = Steps;

const baseURL = 'design-service/admin/design';

export default memo(function DesignInfo({
  history,
  template,
  isVisible,
  setVisible,
  isUpdateDesign,
  design,
  onFinish,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidInfo, setValidInfo] = useState(false);
  const [isValidDesign, setValidDesign] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [designActionRefs, setDesignActionRefs] = useState({});
  const [infoActionRefs, setInfoActionRefs] = useState({});

  useEffect(() => {
    resetData();
  }, [isUpdateDesign, design]);

  const steps = [
    {
      title: 'Info',
      getContent: props => {
        return <InfoBasic {...props}></InfoBasic>;
      },
    },
    {
      title: 'Design',
      getContent: props => {
        return <DesignTool {...props}></DesignTool>;
      },
    },
  ];

  const maxStepIndex = steps.length - 1;

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const makeRequestSave = async body => {
    let url = `${baseURL}`;
    const method = isUpdateDesign ? 'put' : 'post';
    if (isUpdateDesign) {
      url += '/' + design.id;
    }

    const { is_success } = await request(url, {
      method: method,
      data: body,
    });
    if (is_success) {
      notification(
        'success',
        (isUpdateDesign ? `Cập nhật` : 'Thêm') + ' design template thành công!',
        'Thành công!',
      );
      onFinish();
    }
  };

  const uploadThumbnail = () => {
    return new Promise((resolve, reject) => {
      try {
        designActionRefs.focusOut();
        designActionRefs.getCanvas().toBlob(function (blob) {
          uploadImage(blob).then(data => {
            setLoading(false);
            resolve(data.data);
          });
        });
      } catch (ex) {
        reject();
      }
    });
  };

  const saveDesign = async () => {
    setLoading(true);
    const thumb = await uploadThumbnail();
    const body = {
      ...{ artwork_template_id: template?.id },
      ...infoActionRefs.getData(),
      layers: designActionRefs.getLayers(),
      thumb,
    };
    await makeRequestSave(body);
    resetData();
    setLoading(false);
  };

  const resetData = async () => {
    setCurrentStep(0);
    setValidInfo(isUpdateDesign);
    setValidDesign(isUpdateDesign);
  };

  return (
    <Modal
      width="1068px"
      visible={isVisible}
      onCancel={() => setVisible(false)}
      title={
        <TitleWrapper className="page-title-wrapper">
          <span className="page-title">Create a design template</span>
          <Steps size="small" current={currentStep} className="page-steps">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </TitleWrapper>
      }
      footer={
        <FooterWrapper className="page-footer">
          <div className="footer-action">
            <Button
              disabled={isLoading || currentStep === 0}
              context="secondary"
              className="btn-sm"
              onClick={prev}
            >
              Back
            </Button>
            <Button
              disabled={
                isLoading || (currentStep === 0 ? !isValidInfo : !isValidDesign)
              }
              className="btn-sm"
              onClick={currentStep === maxStepIndex ? saveDesign : next}
            >
              {currentStep === maxStepIndex
                ? 'Save artwork template'
                : 'Continue'}
            </Button>
          </div>
        </FooterWrapper>
      }
    >
      <Spin spinning={isLoading} indicator={loadingIcon}>
        <PageWrapperDefault>
          <div className="page-content">
            {steps.map((step, index) => (
              <div
                key={`step-${index}`}
                className={`page-step${
                  index === currentStep ? ' step-active' : ''
                }`}
              >
                {step.getContent(
                  index === 0
                    ? {
                        setValid: setValidInfo,
                        design,
                        template,
                        setActionRefs: setInfoActionRefs,
                      }
                    : {
                        setValid: setValidDesign,
                        setLoading,
                        design,
                        setActionRefs: setDesignActionRefs,
                      },
                )}
              </div>
            ))}
          </div>
        </PageWrapperDefault>
      </Spin>
    </Modal>
  );
});

export const TitleWrapper = styled.div`
  &.page-title-wrapper {
    display: flex;
    align-items: center;
  }
  .page-title {
    font-weight: 700;
    font-size: 16px;
  }
  .page-steps {
    max-width: 170px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const FooterWrapper = styled.div`
  &.page-footer {
    position: absolute;
    text-align: right;
    left: 0;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #ebebf0;
    width: 100%;
    height: 61px;
  }
  .footer-action {
    display: inline-flex;
    padding: 13px 20px;
    > button:not(:first-child) {
      margin-left: 10px;
    }
  }
`;

export const PageWrapperDefault = styled(PageWrapper)`
  min-height: calc(100vh - 350px);
  margin: 1.5rem auto;
  .ant-spin-nested-loading > div > .ant-spin {
    max-height: unset;
  }
  .page-layout-wrapper {
    height: calc(100vh - 3rem - 64px);
    overflow-y: auto;
    position: relative;
  }

  .page-content {
    padding-top: 30px;
  }
  .page-step {
    display: none;
  }
  .step-active {
    display: block;
  }
`;
