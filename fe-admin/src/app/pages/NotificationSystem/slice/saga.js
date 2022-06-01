import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { notificationsActions as actions } from '.';
import { message } from 'antd';

const COMMON_SERVICE_URL = 'common-service/admin/notifications';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${COMMON_SERVICE_URL}${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${COMMON_SERVICE_URL}/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError(err.data));
  }
}

export function* createNotify({ payload }) {
  yield delay(500);
  const requestURL = `${COMMON_SERVICE_URL}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Tạo thông báo mới thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.createNotifyDone());
    } else {
      yield put(actions.createNotifyError());
    }
    // if (!id) push('/warehousing');
  } catch (err) {
    yield put(actions.createNotifyError());
  }
}

export function* notificationsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.createNotify.type, createNotify);
}
