/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import request from 'utils/request';
import { GlobalStyle } from 'styles/global-styles';
// import { selectAccessToken } from './pages/AppPrivate/slice/selectors';
import { PrivateRoutes } from './pages/AppPrivate/Loadable';
import { useGlobalSlice } from './pages/AppPrivate/slice';
import { Auth } from './pages/Auth/Loadable';
import { isEmpty } from 'lodash';
import { NotFoundPage } from './components';
import { useTranslation } from 'react-i18next';

import 'assets/scss/styles.scss';

declare const window: any;

export function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useGlobalSlice();
  React.useEffect(() => {
    const OneSignal = (window as any)?.OneSignal || [];
    console.log(`window.OneSignal`, OneSignal);
    if (!isEmpty(OneSignal)) {
      OneSignal?.getUserId()
        .then(playerId => {
          console.log(`window.OneSignal1`, playerId);
          if (playerId) {
            request(`user-service/users/me/webpush-token`, {
              method: 'put',
              data: { player_id: playerId },
            })
              .then(response => response)
              .catch(error => error);
          }

          // addOnesignalPlayerId({ player_id });
        })
        .catch(e => console.log(`window.OneSignal2`, e));
      // OneSignal?.push(() => {
      //   OneSignal?.getUserId()
      //     .then(playerId => {
      //       console.log(`window.OneSignal21`, playerId);
      //       if (playerId) {
      //         request(`user-service/users/me/webpush-token`, {
      //           method: 'put',
      //           data: { player_id: playerId },
      //         })
      //           .then(response => response)
      //           .catch(error => error);

      //         // addOnesignalPlayerId({ player_id });
      //       }
      //     })
      //     .catch(e => console.log(`window.OneSignal22`, e));
      //   // OneSignal.init({
      //   //   appId: REACT_APP_ONESIGNAL_APP_ID,
      //   // });
      // });
    }

    dispatch(actions.getUserInfo());
  }, []);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Admin"
        defaultTitle="Admin"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A admin application" />
      </Helmet>
      <Switch>
        <Route path="/auth/:type?" component={Auth} />
        <Route path="/health">
          <h3>Hey There!!! The App is Healthy</h3>
        </Route>
        <PrivateRoutes />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
