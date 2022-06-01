/**
 *
 * Asynchronously loads the component for Orders
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ArtWorks = lazyLoad(
  () => import('./index'),
  module => module.ArtWorks,
);
