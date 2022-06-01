/* --- STATE --- */
export interface dataStores {
  data: any;
}

export interface StoresState extends dataStores {
  loading: boolean;
  detail: any;
}

export type ContainerState = StoresState;
