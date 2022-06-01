/**
 *
 * Asynchronously loads the component for Orders
 *
 */

import { lazyLoad } from 'utils/loadable';

export const NotificationSystem = lazyLoad(
  () => import('./index'),
  module => module.NotificationSystem,
);
