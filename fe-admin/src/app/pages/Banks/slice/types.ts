/* --- STATE --- */
export interface dataBanks {
  data: any;
}

export interface BanksState extends dataBanks {
  loading: boolean;
  detail: any;
}

export type ContainerState = BanksState;
