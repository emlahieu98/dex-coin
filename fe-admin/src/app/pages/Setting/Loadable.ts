/**
 *
 * Asynchronously loads the component for Stores
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Setting = lazyLoad(
  () => import('./index'),
  module => module.Setting,
);
