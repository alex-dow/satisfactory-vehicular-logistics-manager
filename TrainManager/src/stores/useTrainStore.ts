import { defineStore } from "pinia";
import { computed, isReactive, isRef, ref, shallowRef, unref } from "vue";

import type { BasicItem } from "@/satisfactory/types";

import { db, type TrainStation } from "@/satisfactory/trainStations";

export const useTrainStore = defineStore("train-store", () => {
  const trainStations = ref<TrainStation[]>([]);

  const refresh = async () => {
    const dbStations = await db.stations.toArray();
    trainStations.value = dbStations;
  };

  const saveStation = async (stationIdx: number, station: TrainStation) => {
    try {
      station = JSON.parse(JSON.stringify(station)); // remove proxies

      console.log("Save train station:", station);
      await db.stations.put({ ...station });
    } catch (err) {
      console.error("[train] Failed to save station into db:", err);
    }
    const newStations = [...trainStations.value];
    newStations.splice(stationIdx, 1, station);
    trainStations.value = newStations;
  };

  const addStation = async (name: string) => {
    await db.stations.add({
      name,
      platforms: [],
    });
    await refresh();
  };

  const addPlatform = async (stationId: number) => {
    const trainStationIdx = trainStations.value.findIndex(
      (ts) => ts.id === stationId,
    );
    if (trainStationIdx === -1) {
      console.error(
        "[train] Adding platform to non existing train station. ID:" +
          stationId,
      );
      return;
    }

    const trainStation = trainStations.value[trainStationIdx];
    trainStation.platforms.push({
      inputs: [],
      outputs: [],
    });
    await saveStation(trainStationIdx, trainStation);
  };

  const removePlatform = async (
    stationId: number,
    platformPosition: number,
  ) => {
    const trainStationIdx = trainStations.value.findIndex(
      (ts) => ts.id === stationId,
    );
    const trainStation = trainStations.value[trainStationIdx];

    if (platformPosition >= trainStation.platforms.length) {
      throw new Error(
        "[train] Invalid platform position for train station #" +
          stationId +
          " - " +
          platformPosition,
      );
    }
    trainStation.platforms.splice(platformPosition, 1);

    await saveStation(trainStationIdx, trainStation);
  };

  const removePlatformItem = async (
    stationId: number,
    platformPosition: number,
    item: BasicItem,
    direction: "input" | "output",
  ) => {
    const trainStationIdx = trainStations.value.findIndex(
      (ts) => ts.id === stationId,
    );
    const trainStation = trainStations.value[trainStationIdx];
    const platform = trainStation.platforms[platformPosition];

    const values = direction === "input" ? platform.inputs : platform.outputs;

    const valueIdx = values.findIndex((value) => value.item.id === item.id);
    if (valueIdx > -1) {
      values.splice(valueIdx, 1);
    }

    if (direction === "input") {
      platform.inputs = values;
    } else {
      platform.outputs = values;
    }
    trainStation.platforms[platformPosition] = platform;
    await saveStation(trainStationIdx, trainStation);
  };

  const addPlatformItem = async (
    stationId: number,
    platformPosition: number,
    item: BasicItem,
    rate: number,
    direction: "input" | "output",
  ) => {
    const trainStationIdx = trainStations.value.findIndex(
      (ts) => ts.id === stationId,
    );
    const trainStation = trainStations.value[trainStationIdx];

    const platform = trainStation.platforms[platformPosition];
    if (direction === "input") {
      platform.inputs.push({
        item,
        rate,
      });
    } else {
      platform.outputs.push({
        item,
        rate,
      });
    }

    trainStation.platforms[platformPosition] = platform;
    await saveStation(trainStationIdx, trainStation);
  };

  const deleteStation = async (id: number) => {
    await db.stations.delete(id);
    await refresh();
  };

  const totalInputs = computed(() => {
    const obj: Record<string, { item: BasicItem; rate: number }> = {};

    trainStations.value.forEach((trainStation) => {
      if (trainStation.platforms) {
        trainStation.platforms.forEach((platform) => {
          if (platform.inputs) {
            platform.inputs.forEach((input) => {
              if (!obj[input.item.id]) {
                obj[input.item.id] = {
                  item: input.item,
                  rate: input.rate,
                };
              } else {
                obj[input.item.id].rate += input.rate;
              }
            });
          }
        });
      }
    });
    return obj;
  });

  const totalOutputs = computed(() => {
    const obj: Record<string, { item: BasicItem; rate: number }> = {};
    trainStations.value.forEach((trainStation) => {
      if (trainStation.platforms) {
        trainStation.platforms.forEach((platform) => {
          if (platform.outputs) {
            platform.outputs.forEach((output) => {
              if (!obj[output.item.id]) {
                obj[output.item.id] = {
                  item: output.item,
                  rate: output.rate,
                };
              } else {
                obj[output.item.id].rate += output.rate;
              }
            });
          }
        });
      }
    });
    return obj;
  });

  const availableResources = computed(() => {
    const obj: Record<string, { item: BasicItem; rate: number }> = {};

    for (const itemId in totalOutputs.value) {
      const output = totalOutputs.value[itemId];
      obj[output.item.id] = {
        item: output.item,
        rate: output.rate,
      };
    }

    for (const itemId in totalInputs.value) {
      const input = totalInputs.value[itemId];
      if (obj[input.item.id]) {
        obj[input.item.id].rate -= input.rate;
      } else {
        obj[input.item.id] = {
          item: input.item,
          rate: -Math.abs(input.rate),
        };
      }
    }

    return obj;
  });

  return {
    trainStations,
    refresh,
    addStation,
    deleteStation,
    totalInputs,
    totalOutputs,
    availableResources,
    addPlatform,
    addPlatformItem,
    removePlatformItem,
    removePlatform,
  };
});
