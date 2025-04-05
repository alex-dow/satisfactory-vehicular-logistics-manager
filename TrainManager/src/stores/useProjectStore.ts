import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";

import type { TMPlatformItem, TMPlatformMode, TMProject } from "@/api/types";

export const useProjectStore = defineStore("current-project", () => {
  const modified = ref(false);

  const project = ref<TMProject | null>(null);

  const setCurrentProject = async (p: TMProject | null) => {
    project.value = JSON.parse(JSON.stringify(p));
    modified.value = false;
  };

  const addTruckStation = (stationName: string) => {
    modified.value = true;
    project.value?.truck_stations.push({
      station_name: stationName,
      direction: "load",
      items: [],
    });
  };

  const setTruckStationMode = (stationIdx: number, mode: TMPlatformMode) => {
    if (!project.value) return;
    if (stationIdx >= project.value.truck_stations.length) return;

    project.value.truck_stations[stationIdx].direction = mode;
    modified.value = true;
  };

  const renameTruckStation = (stationIdx: number, stationName: string) => {
    if (!project.value) return;
    if (stationIdx >= project.value.truck_stations.length) return;

    project.value.train_stations[stationIdx].station_name = stationName;
    modified.value = true;
  };

  const deleteTruckStation = (stationIdx: number) => {
    if (!project.value) return;
    if (stationIdx >= project.value.truck_stations.length) return;
    project.value.truck_stations.splice(stationIdx, 1);
    modified.value = true;
  };

  const addTruckStationItem = (stationIdx: number, item: TMPlatformItem) => {
    if (!project.value) return;
    if (stationIdx >= project.value.truck_stations.length) return;
    project.value.truck_stations[stationIdx].items.push(item);
    modified.value = true;
  };

  const removeTruckStationItem = (stationIdx: number, itemIdx: number) => {
    if (!project.value) {
      console.error("Removing truck station item when project is not loaded");
      return;
    }
    if (stationIdx >= project.value.truck_stations.length || stationIdx < 0) {
      console.error("Truck station index " + stationIdx + " does not exist");
      return;
    }
    if (itemIdx >= project.value.truck_stations[stationIdx].items.length || itemIdx < 0) {
      console.error("Item index " + itemIdx + " does not exist");
      return;
    }
    project.value.truck_stations[stationIdx].items.splice(itemIdx, 1);
    modified.value = true;
  };

  const updateTruckStationItem = (stationIdx: number, itemIdx: number, item: TMPlatformItem) => {
    if (!project.value) throw new Error("Project not loaded");
    if (stationIdx < 0 || stationIdx >= project.value.truck_stations.length) throw new Error("Invalid station index: " + stationIdx);
    if (itemIdx < 0 || itemIdx >= project.value.truck_stations[stationIdx].items.length) throw new Error("Invalid item idex: " + itemIdx);
    project.value.truck_stations[stationIdx].items.splice(itemIdx, 1, item);
    modified.value = true;
  };

  const addTrainStation = (stationName: string) => {
    modified.value = true;
    project.value?.train_stations.push({
      station_name: stationName,
      platforms: [],
    });
  };

  const renameTrainStation = (stationIdx: number, stationName: string) => {
    if (!project.value) return;
    if (stationIdx >= project.value.train_stations.length) return;
    project.value.train_stations[stationIdx].station_name = stationName;
    modified.value = true;
  };

  const removeTrainStation = (stationIndex: number) => {
    modified.value = true;
    project.value?.train_stations.splice(stationIndex, 1);
  };

  const togglePlatformMode = (stationIndex: number, platformIndex: number) => {
    if (!project.value) return;
    if (project.value.train_stations[stationIndex].platforms[platformIndex].mode === "load") {
      setPlatformMode(stationIndex, platformIndex, "unload");
    } else {
      setPlatformMode(stationIndex, platformIndex, "load");
    }
  };

  const setPlatformMode = (stationIndex: number, platformIndex: number, mode: TMPlatformMode) => {
    modified.value = true;
    if (!project.value) return;
    project.value.train_stations[stationIndex].platforms[platformIndex].mode = mode;
  };

  const addPlatform = (stationIndex: number) => {
    modified.value = true;
    if (project.value === null) {
      throw new Error("A project hasn't be loaded yet.");
    }

    if (stationIndex >= project.value.train_stations.length) {
      throw new Error("Adding a platform to a station that does not exist in the current project");
    }

    project.value?.train_stations[stationIndex].platforms.push({
      items: [],
      mode: "load",
    });
  };

  const removePlatform = (stationIndex: number, platformIndex: number) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms.splice(platformIndex, 1);
  };

  const addPlatformItem = (stationIndex: number, platformIndex: number, item: TMPlatformItem) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[platformIndex].items.push(item);
  };

  const removePlatformItem = (stationIndex: number, platformIndex: number, itemIndex: number) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[platformIndex].items.splice(itemIndex, 1);
  };

  const updatePlatformItem = (stationIdx: number, platformIdx: number, itemIdx: number, item: TMPlatformItem) => {
    if (!project.value) throw new Error("Project not loaded yet");
    if (stationIdx < 0 || stationIdx >= project.value.train_stations.length) throw new Error("Invalid station index: " + stationIdx);
    if (platformIdx < 0 || platformIdx >= project.value.train_stations[stationIdx].platforms.length)
      throw new Error("Inalid platform index: " + platformIdx);
    if (itemIdx < 0 || itemIdx >= project.value.train_stations[stationIdx].platforms[platformIdx].items.length)
      throw new Error("Invalid item index: " + itemIdx);

    project.value.train_stations[stationIdx].platforms[platformIdx].items.splice(itemIdx, 1, item);
    modified.value = true;
  };

  const resetModifiedState = () => {
    modified.value = false;
  };

  const movePlatformUp = (stationIndex: number, platformIndex: number) => {
    if (platformIndex == 0) {
      return;
    }

    const platform = project.value?.train_stations[stationIndex].platforms[platformIndex];

    project.value?.train_stations[stationIndex].platforms.splice(platformIndex, 1);
    project.value?.train_stations[stationIndex].platforms.splice(platformIndex - 1, 0, platform);
    modified.value = true;
  };

  const movePlatformDown = (stationIndex: number, platformIndex: number) => {
    if (platformIndex >= project.value?.train_stations[stationIndex].platforms.length - 1) {
      return;
    }

    const platform = project.value?.train_stations[stationIndex].platforms[platformIndex];

    project.value?.train_stations[stationIndex].platforms.splice(platformIndex, 1);
    project.value?.train_stations[stationIndex].platforms.splice(platformIndex + 1, 0, platform);
    modified.value = true;
  };

  return {
    project,
    modified,

    setCurrentProject,

    addPlatform,
    addTrainStation,
    removeTrainStation,
    removePlatform,
    addPlatformItem,
    updatePlatformItem,
    removePlatformItem,
    resetModifiedState,
    setPlatformMode,
    togglePlatformMode,
    movePlatformUp,
    movePlatformDown,
    renameTrainStation,

    renameTruckStation,
    deleteTruckStation,
    addTruckStation,
    addTruckStationItem,
    removeTruckStationItem,
    updateTruckStationItem,
    setTruckStationMode,
  };
});
