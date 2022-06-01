import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { suppliersActions as actions } from '.';

const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/suppliers${payload}`;
  // console.log(requestURL);
  try {
    // Call our request helper (see 'utils/request')
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
  const requestURL = `${USER_SERVICE}admin/supplier/${payload}`;
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

export function* TransferStatusSupplier({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/users/${payload.id}/approve-supplier`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      const url = '?page=1&page_size=10';
      yield put(actions.getData(url));
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}
export function* TransferStatusSupplierDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/users/${payload.data.id}/approve-supplier`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDetail(payload.data.id));
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* UpdateSupplier({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/supplier/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      const url = '?page=1&page_size=10';
      yield put(actions.getData(url));
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* UpdateSupplierDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/supplier/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDetail(payload.id));
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* suppliersSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.TransferStatusSupplier.type, TransferStatusSupplier);
  yield takeLatest(
    actions.TransferStatusSupplierDetail.type,
    TransferStatusSupplierDetail,
  );
  yield takeLatest(actions.UpdateSupplier.type, UpdateSupplier);
  yield takeLatest(actions.UpdateSupplierDetail.type, UpdateSupplierDetail);
}
