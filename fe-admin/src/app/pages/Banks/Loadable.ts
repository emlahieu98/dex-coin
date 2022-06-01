/**
 *
 * Asynchronously loads the component for Banks
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Banks = lazyLoad(
  () => import('./index'),
  module => module.Banks,
);
