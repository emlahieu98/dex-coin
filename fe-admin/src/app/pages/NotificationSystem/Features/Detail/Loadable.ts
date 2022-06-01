/**
 *
 * Asynchronously loads the component for ...
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailNotification = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
