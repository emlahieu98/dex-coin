import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    /* padding-top: ${StyleConstants.headerHeight}; */
    background-color: ${p => p.theme.background};
    color: ${p => p.theme.text};
  }

  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .text-white {
    color: #fff !important;
  }
  .text-primary {
    color: ${p => p.theme.primary} !important;
  }
  .text-secondary {
    color: ${p => p.theme.textSecondary} !important;
  }
  .text-blue1 {
    color: ${p => p.theme.darkBlue1} !important;
  }

  .text-center {
    text-align: center !important;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .pointer {
    cursor: pointer !important;
  }

  /* .m-0 {
    margin: 0 !important;
  } */
  .w-100 {
    width: 100% !important;
  }
  .h-100 {
    height: 100% !important;
  }
  .popover-notify--global {
    top: 64px !important;
    position: fixed;
    padding-top: 0px !important;
    .ant-popover-arrow {
       visibility: hidden;
    }
    .ant-popover-placement-bottom, .ant-popover-placement-bottomLeft, .ant-popover-placement-bottomRight {
      padding-top: 0px !important;
    }
    .ant-popover-inner-content {
       /* padding: 21px 25px; */
       padding: 21px 0;
       max-height: 1000px;
    }
  }
  .popover-action--global {
    position: fixed;
    padding-top: 9px !important;
    .ant-popover-inner {
      border-radius: 4px;
    }
    .ant-popover-inner-content {
      padding: 4px 4px;
    }
    .anticon {
      vertical-align: 0;
      margin-top: 8px;
      margin-right: 2px;
    }
  }
  .progress-bar--global {
    left: 18px;
    width: unset;
    max-width: unset;
    padding: 0;
    .ant-notification-notice-message {
      margin-bottom: 0;
    }
    .ant-notification-notice-close {
      display: none;
    }
  }
`;
