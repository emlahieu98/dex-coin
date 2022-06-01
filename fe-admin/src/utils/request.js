import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { message } from 'antd';
// import { selectAccessToken } from 'app/pages/AppPrivate/slice/selectors';
import { store } from '../';
import notification from 'utils/notification';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
import fileDownload from 'js-file-download';
const UPLOAD_IMAGE_FILE = 'common-service/';
const SEPARATE_ERROR_HANDLING_LIST = [
  'user-service/active-user',
  'user-service/signin',
  'user-service/signup',
  'user-service/forgot',
  'user-service/reset-password',
  'user-service/users/me/change-password',
  'sales-channels-service/lazada/auth/grant',
  'user-service/verify-invite-user',
  'user-service/users/me/webpush-token',
];

var draftTokens = {};
export async function checkErrorCode(data) {
  const { config } = data || {};
  switch (true) {
    // data?.status === 401
    case data?.data?.error_code === 'unauthorized' ||
      data?.data?.error_code === 'invalid_refresh_token':
      localStorage.clear();
      if (!window.location.pathname.includes('auth'))
        window.location.href = '/auth/signin';
      break;
    case data?.data?.error_code === 'token_expired':
      const accessData = store?.getState()?.global?.tokens;
      const refreshData = await request('user-service/refresh', {
        requireAuth: false,
        params: { refresh_token: accessData.refresh_token },
      });
      store.dispatch(globalActions.changeTokens(refreshData?.data));
      saveToken(refreshData?.data);
      draftTokens = refreshData?.data;
      const newData = await request(config.url, {
        method: config.method,
        data: config.data,
        accessToken: refreshData?.data?.access_token,
      });
      return newData;
    default:
      break;
  }
  handleShowMessageError(data);

  return {};
}

const handleShowMessageError = response => {
  if (
    SEPARATE_ERROR_HANDLING_LIST.map(
      item => process.env.REACT_APP_HOST + '/' + item,
    ).includes(response?.config?.url)
  )
    return;
  if (
    response?.data?.error_code ===
      '"keyword" length must be at least 2 characters long' &&
    response?.data?.is_success === false
  ) {
    notification('error', 'Từ khóa tìm kiếm phải lớn hơn 2 ký tự');
  } else if (
    response?.data?.error_code &&
    response?.data?.is_success === false
  ) {
    notification('error', response?.data?.error_code, 'error', 10);
  } else {
    notification('error', 'Có lỗi xảy ra. Xin vui lòng thử  lại!');
    console.log('Error:', response);
  }
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
});

axiosInstance.interceptors.response.use(
  resp => {
    const { data, status } = resp;
    // if (data.accessToken) setInfo("accessToken", data.accessToken);
    if (!status || Math.floor(status / 100) === 2) {
      if (data?.is_success) {
        const validateData = data.code === undefined ? data : data;
        return validateData;
      } else {
        handleShowMessageError(resp);
      }
    }
    return Promise.reject(resp);
  },
  error => {
    const { response } = error;
    // todo: check TH token hết hạn + refresh token còn hạn , error_code = token_expired
    // todo: Nếu refresh thành công và có access token mới phải recall lại api trên
    // todo: Khong nen xu ly trong interceptors, Khó viết wrapper
    checkErrorCode(response);
    if (response) return Promise.reject(response);
    return Promise.reject(error);
  },
);

async function checkAccessToken() {
  const accessData = store?.getState()?.global?.tokens;
  const current = new Date().getTime();
  const restTime = accessData?.access_token_exp - current;
  const needRefresh = restTime / (1000 * 60 * 60) < 1;
  if (
    needRefresh &&
    accessData?.refresh_token &&
    accessData?.refresh_token_exp
  ) {
    if (accessData.refresh_token_exp - current > 0) {
      const refreshData = await request('user-service/refresh', {
        requireAuth: false,
        params: { refresh_token: accessData.refresh_token },
      });
      saveToken(refreshData?.data);
      store.dispatch(globalActions.changeTokens(refreshData?.data));
      draftTokens = refreshData?.data;
      return true;
    } else {
      return true;
    }
  }
  return true;
}

const request = async (
  url,
  {
    method = 'GET',
    params = null,
    contentType = 'application/json',
    data = {},
    requireAuth = true,
    isUpload = false,
    isCheckRefresh = false,
    accessToken = '',
  } = {},
) => {
  let headers = {
    'Content-Type': contentType,
    // deviceType: "web",
    'x-source': 'admin',
  };
  if (isCheckRefresh === true) {
    const checkResult = await checkAccessToken();
    if (!checkResult) return;
    // todo somthing ...
  }
  if (isUpload) {
    headers['Content-Type'] = 'multipart/form-data';
    const formData = new FormData();
    if (data?.length) {
      data.forEach(file => {
        formData.append('file', file);
      });
    } else {
      formData.append('file', data);
    }
    data = formData;
  }
  if (requireAuth) {
    if (!store?.getState()?.global?.accessToken) return;
    headers.Authorization = `Bearer ${
      accessToken ||
      draftTokens.access_token ||
      store?.getState()?.global?.accessToken
    }`;
  }
  let handleUrl = url;
  if (url && !url.startsWith('http')) {
    handleUrl = `${process.env.REACT_APP_HOST}/${url}`;
  }
  return axiosInstance({
    method,
    headers,
    url: handleUrl,
    params,
    data,
  });
};

export function uploadImage(files, url) {
  return request(url || `${UPLOAD_IMAGE_FILE}upload-image-file`, {
    method: 'post',
    isUpload: true,
    data: files,
    params: { source: 'admin' },
  });
}

export function uploadFile(file) {
  return request(`${UPLOAD_IMAGE_FILE}upload-file`, {
    method: 'post',
    isUpload: true,
    data: file,
    params: { source: 'admin' },
  });
}

export async function downloadFile(
  url,
  fileName,
  method = 'get',
  data,
  accessToken,
) {
  let headers = {
    'x-source': 'admin',
  };
  headers.Authorization = `Bearer ${
    accessToken ||
    draftTokens.access_token ||
    store?.getState()?.global?.accessToken
  }`;
  const requestUrl = `${process.env.REACT_APP_HOST}/${url}`;
  try {
    const response = await axios({
      method,
      url: requestUrl,
      headers,
      ...(data ? { data } : {}),
      responseType: 'blob',
    });
    fileDownload(response.data, fileName);
  } catch (error) {
    notification('error', 'Có lỗi xảy ra. Xin vui lòng thử  lại!');
    console.log('Error:', error);
  }
}

export default request;
