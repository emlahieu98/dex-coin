/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Admins = lazyLoad(
  () => import('./index'),
  module => module.Admins,
);
