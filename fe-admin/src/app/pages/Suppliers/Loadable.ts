/**
 *
 * Asynchronously loads the component for Suppliers
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Suppliers = lazyLoad(
  () => import('./index'),
  module => module.Suppliers,
);
