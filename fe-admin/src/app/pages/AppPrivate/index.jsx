/**
 *
 * AppPrivate
 *
 */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'app/components';
import { isEmpty } from 'lodash';
import { isAdmin } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectRoles } from 'app/pages/AppPrivate/slice/selectors';
import { menus } from 'app/pages/AppPrivate/Layout/constants';
import { AppLayout } from './Layout';
import { NotFoundPage, Incoming } from 'app/components';

import AuthRoute from './AuthRoute';
import { HomePage } from '../HomePage/Loadable';
import { Users } from '../Users/Loadable';
import { DetailUser } from '../Users/Features/Detail/Loadable';

import { Admins } from '../Admins/Loadable';
import { DetailAdmin } from '../Admins/Features/Detail/Loadable';
import { Products } from '../Products/Loadable';
import { Categories } from '../Categories/Loadable';
import { Transactions } from '../Accountant/Transactions/Loadable';
import { Suppliers } from '../Suppliers/Loadable';
import { Banks } from '../Banks/Loadable';
import { DetailProducts } from '../Products/Features/Detail/Loadable';
import { DetailCategories } from '../Categories/Features/Detail/Loadable';
import { DetailBanks } from '../Banks/Features/Detail/Loadable';
import { DetailTransaction } from '../Accountant/Transactions/Features/Detail/Loadable';
import { DetailSupplier } from '../Suppliers/Features/Detail/Loadable';
import { CreateAndUpdateProducts } from '../Products/Features/CreateAndUpdate/Loadable';
import { UpdateCategories } from '../Categories/Features/CreateAndUpdate/Loadable';
import { CreateCategories } from '../Categories/Features/CreateAndUpdate/Loadable';
import { UpdateBanks } from '../Banks/Features/CreateAndUpdate/Loadable';
import { CreateBanks } from '../Banks/Features/CreateAndUpdate/Loadable';
import { Stores } from 'app/pages/Stores/Loadable';
import { Orders } from 'app/pages/Orders/Loadable';
import { UpdateOrder } from 'app/pages/Orders/Features/Update/Loadable';
import { MyProfile } from '../MyProfile/Loadable';
import { Setting } from 'app/pages/Setting/Loadable';
import { ArtWorkTemplates } from '../ArtworkTemplate';
import { TemplateInfo } from '../ArtworkTemplate/Features/Save/Loadable';
import { ListDesign } from '../ArtworkTemplate/Features/Save/Loadable';

import { AccountantHandleDeposit } from '../Accountant/AccountantHandleDeposit/Loadable';
import { DetailAccountantHandleDeposit } from '../Accountant/AccountantHandleDeposit/Features/Detail/Loadable';
import { AccountantHandleWithdrawal } from '../Accountant/AccountantHandleWithdrawal/Loadable';
import { DetailAccountantHandleWithdrawal } from '../Accountant/AccountantHandleWithdrawal/Features/Detail/Loadable';

import { AccountDebtPeriodOverview } from '../Accountant/AccountDebtPeriodOverview/Loadable';
// import { AccountantDetailPeriodList } from '../AccountDebtPeriodOverview/Features/DetailTransaction/Loadable';
import { UserDebtDetail } from '../Accountant/AccountDebtPeriodOverview/Features/UserDebtDetail/Loadable';
import { AccountantPeriodOverviewDetailTransaction } from '../Accountant/AccountDebtPeriodOverview/Features/DetailTransaction/Loadable';
import { AccountDebtByPeriod } from '../Accountant/AccountDebtByPeriod/Loadable';
import { AccountPartnership } from '../Accountant/AccountPartnership/Loadable';
import { DetailAccountPartnership } from '../Accountant/AccountPartnership/Features/Detail/Loadable';
import { ListOrderSeller } from '../Accountant/AccountPartnership/Features/ListOrderSeller/Loadable';
import { NotificationSystem } from '../NotificationSystem/Loadable';
import { DetailNotification } from '../NotificationSystem/Features/Detail/Loadable';
import { CreateNotification } from '../NotificationSystem/Features/Create/Loadable';

import { selectLoading } from './slice/selectors';

const lists = [
  {
    path: '/',
    title: 'home',
    Component: HomePage,
  },
  {
    path: '/products',
    title: 'product.list',
    Component: Products,
  },
  {
    path: '/products/Detail/:id',
    title: 'product.detail',
    Component: DetailProducts,
  },
  {
    path: '/products/uc/:id?',
    title: 'product.update',
    Component: CreateAndUpdateProducts,
  },
  {
    path: '/users',
    title: 'user.list',
    Component: Users,
  },
  {
    path: '/users/detail/:id/:type',
    title: 'user.info',
    Component: DetailUser,
  },

  {
    path: '/admins',
    title: 'user.admin.list',
    Component: Admins,
  },
  {
    path: '/admins/detail/:id/:type',
    title: 'user.admin.info',
    Component: DetailAdmin,
  },
  {
    path: '/categories',
    title: 'category.list',
    Component: Categories,
  },
  {
    path: '/artwork-templates',
    title: 'artwork.list',
    Component: ArtWorkTemplates,
  },
  {
    path: '/artwork-templates/uc',
    title: 'artwork.add',
    Component: TemplateInfo,
  },
  {
    path: '/artwork-templates/uc/:id',
    title: 'artwork.update',
    Component: TemplateInfo,
  },
  {
    path: '/artwork-templates/:id/designs',
    title: 'artwork.designs.update',
    Component: ListDesign,
  },
  {
    path: '/categories/:id/detail',
    title: 'category.detail',
    Component: DetailCategories,
  },
  {
    path: '/categories/uc',
    title: 'category.create',
    Component: CreateCategories,
  },
  {
    path: '/categories/uc/:id?',
    title: 'category.update',
    Component: UpdateCategories,
  },
  {
    path: '/transactions',
    title: 'transaction.list',
    Component: Transactions,
  },
  {
    path: '/transactions/:id/detail',
    title: 'transaction.detail',
    Component: DetailTransaction,
  },
  {
    path: '/transactions/verify',
    title: 'transaction.verify',
    Component: HomePage,
  },
  {
    path: '/setting/banks',
    title: 'bank.list',
    Component: Banks,
  },
  {
    path: '/setting/banks/:id/detail',
    title: 'bank.detail',
    Component: DetailBanks,
  },
  {
    path: '/setting/banks/uc',
    title: 'bank.create',
    Component: CreateBanks,
  },
  {
    path: '/setting/banks/uc/:id?',
    title: 'bank.update',
    Component: UpdateBanks,
  },
  {
    path: '/stores',
    title: 'user.storeConnected',
    Component: Stores,
  },
  {
    path: '/orders',
    title: 'order.list',
    Component: Orders,
  },
  {
    path: '/orders/update/:id',
    title: 'order.update',
    Component: UpdateOrder,
  },
  {
    path: '/myprofile',
    title: 'myprofile.info',
    Component: MyProfile,
  },
  {
    path: '/suppliers',
    title: 'supplier.list',
    Component: Suppliers,
  },
  {
    path: '/suppliers/:id/detail',
    title: 'supplier.detail',
    Component: DetailSupplier,
  },
  {
    path: '/setting',
    title: 'settings.title',
    Component: Setting,
  },

  {
    path: '/accountant/deposit',
    title: 'accountant.listDeposit',
    Component: AccountantHandleDeposit,
  },
  {
    path: '/accountant/deposit/:id/detail',
    title: 'accountant.detail',
    Component: DetailAccountantHandleDeposit,
  },

  {
    path: '/accountant/withdrawal',
    title: 'accountant.listWithdrawal',
    Component: AccountantHandleWithdrawal,
  },
  {
    path: '/accountant/withdrawal/:id/detail',
    title: 'accountant.detail',
    Component: DetailAccountantHandleWithdrawal,
  },

  {
    path: '/accountant/debt-overview',
    title: 'accountant.debtOverview',
    Component: AccountDebtPeriodOverview,
  },
  {
    path: '/accountant/detail-period',
    title: 'accountant.debtOverview',
    Component: AccountDebtByPeriod,
  },
  // {
  //   path: '/accountant/debt-overview/:id/detailPeriod',
  //   title: 'accountant.detailPeriod',
  //   Component: AccountantDetailPeriodList,
  // },
  {
    path: '/accountant/detail-user-debt',
    // path: '/accountant/debt-overview/detailperiod/:id/list',
    title: 'accountant.UserDebtDetail',
    Component: UserDebtDetail,
  },
  {
    path: '/accountant/detail-debt-transaction/:id',
    title: 'accountant.detail',
    Component: AccountantPeriodOverviewDetailTransaction,
  },
  {
    path: '/accountant/partnership',
    title: 'accountant.partnership.title',
    Component: AccountPartnership,
  },
  {
    path: '/accountant/partnership/:id/detail',
    title: 'accountant.partnership.detail',
    Component: DetailAccountPartnership,
  },
  {
    path: '/accountant/partnership/:id/:key/listorder',
    title: 'accountant.partnership.listorder',
    Component: ListOrderSeller,
  },
  {
    path: '/notification-system',
    title: 'notification.list',
    Component: NotificationSystem,
  },
  {
    path: '/notification-system/create',
    title: 'notification.create',
    Component: CreateNotification,
  },
  {
    path: '/notification-system/:id/detail',
    title: 'notification.detail',
    Component: DetailNotification,
  },
];

export const PrivateRoutes = memo(props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  const roles = useSelector(selectRoles);
  const loading = useSelector(selectLoading);

  const routerList = useMemo(() => {
    const admin = isAdmin(roles);

    const handleRouterShow = params => {
      if (
        admin ||
        roles.some(
          v => isEmpty(params.requredRoles) || params.requredRoles?.includes(v),
        )
      ) {
        return lists.filter(r => r.path.includes(params.link));
      }
      return [];
    };

    const listFinal = menus.reduce(
      (final, item) => {
        if (item.link) {
          final = final.concat(handleRouterShow(item));
        } else {
          item.subMenus.forEach(content => {
            final = final.concat(handleRouterShow(content));
          });
        }
        return final;
      },
      [
        {
          path: '/',
          title: 'Home',
          Component: Incoming,
        },
        {
          path: '/dashboard',
          title: 'Dashboard',
          Component: Incoming,
        },
        {
          path: '/myprofile',
          title: 'myprofile.info',
          Component: MyProfile,
        },
        {
          path: '/incoming1',
          title: 'incoming',
          Component: Incoming,
        },
        {
          path: '/incoming2',
          title: 'incoming',
          Component: Incoming,
        },
        {
          path: '/incoming3',
          title: 'incoming',
          Component: Incoming,
        },

        // {
        //   path: '/accounting/dashboard',
        //   title: 'Dashboard',
        //   Component: AccountingDashboard,
        // },
        {
          path: '/accountant/detail-period',
          title: 'accountant.debtOverview',
          Component: AccountDebtByPeriod,
        },
        {
          path: '/accountant/detail-user-debt',
          // path: '/accountant/debt-overview/detailperiod/:id/list',
          title: 'accountant.UserDebtDetail',
          Component: UserDebtDetail,
        },
        {
          path: '/accountant/detail-debt-transaction/:id',
          title: 'accountant.detail',
          Component: AccountantPeriodOverviewDetailTransaction,
        },
      ],
    );
    return listFinal;
  }, [roles]);

  return (
    <AppLayout>
      <Div>
        <Breadcrumb location={props.location} />
        <Switch>
          {routerList.map(item => (
            <AuthRoute
              {...props}
              path={item.path}
              exact={item.exact === false ? false : true}
              key={item.path}
              title={t(item.title)}
              component={item.Component}
            />
          ))}
          {!loading && <Route component={NotFoundPage} />}
        </Switch>
      </Div>
    </AppLayout>
  );
});

const Div = styled.div`
  .site-layout {
    min-height: 100vh;
  }
`;
