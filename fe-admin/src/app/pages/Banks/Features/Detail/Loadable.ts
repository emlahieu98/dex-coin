/**
 *
 * Asynchronously loads the component for Categories
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailBanks = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
