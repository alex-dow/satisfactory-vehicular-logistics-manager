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
  mode: TMPlatformMode;
  items: TMPlatformItem[];
}

export interface TMTrainStation {
  station_name: string;
  platforms: TMPlatform[];
}

export interface TMTruckStation {
  station_name: string;
  direction: TMPlatformMode;
  items: TMPlatformItem[];
}

export interface TMDroneStation {
  station_name: string;
  inputs: TMPlatformItem[];
  outputs: TMPlatformItem[];
}

export interface TMProject {
  id: number;
  owner_id: number;
  project_name: string;
  train_stations: TMTrainStation[];
  truck_stations: TMTruckStation[];
  drone_stations: TMDroneStation[];
}

export type TMPlatformMode = "load" | "unload";
