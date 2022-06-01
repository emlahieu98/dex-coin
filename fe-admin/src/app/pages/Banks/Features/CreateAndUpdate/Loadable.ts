/**
 *
 * Asynchronously loads the component for Banks
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UpdateBanks = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateBanks,
);

export const CreateBanks = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateBanks,
);
