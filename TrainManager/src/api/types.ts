export interface TMUser {
  id: number;
  username: string;
  password?: string;
}

export interface TMPlatformItem {
  item_id: string;
  rate: number;
}

export interface TMPlatform {
  inputs: TMPlatformItem[];
  outputs: TMPlatformItem[];
}

export interface TMTrainStation {
  station_name: string;
  platforms: TMPlatform[];
}

export interface TMProject {
  id: number;
  owner_id: number;
  project_name: string;
  train_stations: TMTrainStation[];
}
