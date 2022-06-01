import { lazyLoad } from 'utils/loadable';

export const DetailUser = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
