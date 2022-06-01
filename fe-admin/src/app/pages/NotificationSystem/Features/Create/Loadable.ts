/**
 *
 * Asynchronously loads the component for ...
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateNotification = lazyLoad(
  () => import('./index'),
  module => module.CreateNotification,
);
