import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { banksActions as actions } from '.';

const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/banks${payload}`;
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
  const requestURL = `${USER_SERVICE}bank/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* update({ payload }) {
  const requestURL = `${USER_SERVICE}bank/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateDone());
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}

export function* create({ payload }) {
  const requestURL = `${USER_SERVICE}banks`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Tạo mới thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateDone());
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}
export function* banksSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.update.type, update);
  yield takeLatest(actions.create.type, create);
}
