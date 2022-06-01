import { call, put, takeLatest, delay } from 'redux-saga/effects';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { message } from 'antd';
import { usersActions as actions } from '.';

const USER_SERVICE = 'user-service';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/admin/users${payload}&is_admin=false`;
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
  const requestURL = `${USER_SERVICE}/admin/users/${payload}`;
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

export function* updateUser({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/admin/users/${payload.id}/profile`;
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
      yield put(actions.getDone(repos));
      yield put(actions.getDetail(payload.id));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDataRoles({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/admin/roles`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataRolesDone(repos));
    } else {
      yield put(actions.getDataRolesError());
    }
  } catch (err) {
    yield put(actions.getDataRolesError());
  }
}

export function* updateRolesUser({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/admin/users/update-roles`;
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
    message.success('Cập nhật phân quyền người dùng thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
      yield put(actions.getDetail(payload.id));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* usersSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateUser.type, updateUser);
  yield takeLatest(actions.getDataRoles.type, getDataRoles);
  yield takeLatest(actions.updateRolesUser.type, updateRolesUser);
}
