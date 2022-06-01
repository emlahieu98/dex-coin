/* --- STATE --- */
export interface dataProducts {
  data: any;
}

export interface ProductsState extends dataProducts {
  loading: boolean;
  detail: any;
}

export type ContainerState = ProductsState;
