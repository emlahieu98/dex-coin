/* --- STATE --- */
export interface dataSetting {
  data: any;
}

export interface SettingState extends dataSetting {
  loading: boolean;
}

export type ContainerState = SettingState;
