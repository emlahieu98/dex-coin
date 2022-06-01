/* --- STATE --- */
export interface dataSuppliers {
  data: any;
}

export interface SuppliersState extends dataSuppliers {
  loading: boolean;
  detail: any;
}

export type ContainerState = SuppliersState;
