import { lazyLoad } from 'utils/loadable';

export const DetailAdmin = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
