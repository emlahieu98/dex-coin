/* --- STATE --- */
export interface GlobalState {
  accessToken: string;
  userInfo: any;
  tokens: any;
  loading: boolean;
  error?: any;
  breadcrumb?: any;
  progress?: any;
}
