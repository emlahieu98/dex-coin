/**
 *
 * Auth
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from 'app/components/PageWrapper';
import { Signin } from './Features/Signin';
import { ForgotPass } from './Features/Forgot-Password';
import { ResetPassword } from './Features/Reset-Password';
import AuthLayout from 'app/components/Auth/Layout';
import 'assets/scss/pages/auth.scss';
import authBg1 from '../../../assets/images/auth/auth-1.svg';
import { messages } from './messages';
import { globalActions, useGlobalSlice } from 'app/pages/AppPrivate/slice';
import { useDispatch } from 'react-redux';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { useSelector } from 'react-redux';

enum authType {
  SIGN_IN = 'signin',
  RESET_PASSWORD = 'reset-password',
  FORGOT_PASS = 'forgot-password',
}
interface Props {
  history?: any;
  location?: {
    search: string | null;
  };
  match?: {
    params: {
      type?: authType | null;
    };
  };
}
export interface AuditCompareRouteParams {
  type: string;
}

export function Auth({ history, location, match }: Props) {
  const type = match?.params?.type ?? authType.SIGN_IN;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useGlobalSlice();

  const userInfo = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (userInfo && userInfo.status === 'active') {
      window.location.href = '/';
    }
  }, [userInfo]);

  return <AuthLayout>{renderComponent(type)}</AuthLayout>;
}

const renderComponent = (type: authType) => {
  switch (type) {
    case authType.FORGOT_PASS:
      return <ForgotPass />;
    case authType.RESET_PASSWORD:
      return <ResetPassword />;
    default:
      return <Signin />;
  }
};
