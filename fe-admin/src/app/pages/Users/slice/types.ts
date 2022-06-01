/* --- STATE --- */
export interface dataUsers {
  data: any;
}

export interface UsersState extends dataUsers {
  loading: boolean;
  detail: any;
  dataRoles: any;
}

export type ContainerState = UsersState;
