import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { storesActions as actions } from '.';
import { serializeAPI } from 'utils/helpers';

export function* getStoresList({ payload }) {
  try {
    const response = yield call(
      request,
      ...[`product-service/admin/stores${payload || '?page_size=10'}`],
    );

    if (response.is_success) {
      yield put(actions.getStoresListDone(response));
    } else {
      yield put(
        actions.getStoresListError(
          response.data?.error_code || response.data?.message,
        ),
      );
    }
  } catch (error) {
    yield put(
      actions.getStoresListError(error.data?.error_code || error.data?.message),
    );
  }
}

export function* storesSaga() {
  yield takeLatest(actions.getStoresList.type, getStoresList);
}
