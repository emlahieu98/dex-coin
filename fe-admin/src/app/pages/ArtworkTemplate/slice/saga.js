import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { artworkTemplatesActions as actions } from '.';
import { message } from 'antd';

// import { message } from 'antd';

const DESIGN_SERVICE = 'design-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${DESIGN_SERVICE}admin/artwork-templates`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, { params: payload }]);
    // const repos = {}
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
  const requestURL = `${DESIGN_SERVICE}admin/artwork-template/${payload}`;
  try {
    // Call our request helper (see 'utils/request')
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
  const requestURL = `${DESIGN_SERVICE}admin/artwork-template/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    message.success('Cập nhật thành công!');
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
  const requestURL = `${DESIGN_SERVICE}admin/artwork-template`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Thêm mới thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.createDone());
    } else {
      yield put(actions.createError());
    }
  } catch (err) {
    yield put(actions.createError());
  }
}

export function* artworkTemplateSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.update.type, update);
  yield takeLatest(actions.create.type, create);
  // yield takeLatest(actions.create.type, create);
}
