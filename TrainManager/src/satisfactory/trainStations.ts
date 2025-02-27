import Dexie from "dexie";

import type { BasicItem } from "./types";
import type { EntityTable } from "dexie";

export interface TrainStationPlatform {
  inputs: PlatformTransfer[];
  outputs: PlatformTransfer[];
}

export interface PlatformTransfer {
  item: BasicItem;
  rate: number;
}

export interface TrainStation {
  id: number;
  name: string;
  platforms: TrainStationPlatform[];
}

const db = new Dexie("train-stations") as Dexie & {
  stations: EntityTable<TrainStation, "id">;
};

db.version(1).stores({
  stations: "++id, name, platforms",
});

export { db };
