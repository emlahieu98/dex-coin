/* --- STATE --- */
export interface dataAdmins {
  data: any;
}

export interface AdminsState extends dataAdmins {
  loading: boolean;
  detail: any;
  dataRoles: any;
}

export type ContainerState = AdminsState;
