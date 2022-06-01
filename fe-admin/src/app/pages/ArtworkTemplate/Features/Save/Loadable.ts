/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TemplateInfo = lazyLoad(
  () => import('./TemplateInfo'),
  module => module.TemplateInfo,
);

export const ListDesign = lazyLoad(
  () => import('./ListDesign'),
  module => module.ListDesign,
);
