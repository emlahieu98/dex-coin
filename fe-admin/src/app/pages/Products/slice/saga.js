import {
  call,
  put,
  takeLatest,
  delay,
  select,
  throttle,
} from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { selectDetail } from './selectors';
import { productsActions as actions } from '.';
import { message } from 'antd';

const PRODUCT_SERVICE = 'product-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${PRODUCT_SERVICE}admin/products${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { isCheckRefresh: true }],
    );
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
  const requestURL = `${PRODUCT_SERVICE}admin/product/${payload}/detail`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* update({ payload }) {
  const requestURL = `${PRODUCT_SERVICE}admin/product/${payload.id}`;
  // const requestURL = `${PRODUCT_SERVICE}supplier/product/${payload.id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    // const repos = {}
    message.success('Cập nhật thành công !');

    if (!isEmpty(repos)) {
      const oldData = yield select(selectDetail);
      yield put(
        actions.getDetailDone({
          ...oldData,
          ...payload.data,
          // publish_status: payload.data,
        }),
      );

      // window.location.reload();
      yield put(actions.updateDone());
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}

export function* productsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield throttle(5000, actions.update.type, update);
}
