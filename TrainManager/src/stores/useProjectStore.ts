import { defineStore } from "pinia";
import { ref, watch } from "vue";

import type {
  TMPlatform,
  TMPlatformItem,
  TMPlatformMode,
  TMProject,
} from "@/api/types";

export const useProjectStore = defineStore("current-project", () => {
  const modified = ref(false);

  const project = ref<TMProject | null>(null);

  const setCurrentProject = async (p: TMProject | null) => {
    console.log(
      "useProjectStore() - set current project and reset modified flag",
    );
    project.value = JSON.parse(JSON.stringify(p));
    modified.value = false;
  };

  const addTrainStation = (stationName: string) => {
    modified.value = true;
    project.value?.train_stations.push({
      station_name: stationName,
      platforms: [],
    });
  };

  const removeTrainStation = (stationIndex: number) => {
    modified.value = true;
    project.value?.train_stations.splice(stationIndex, 1);
  };

  const togglePlatformMode = (stationIndex: number, platformIndex: number) => {
    if (!project.value) return;
    if (
      project.value.train_stations[stationIndex].platforms[platformIndex]
        .mode === "load"
    ) {
      setPlatformMode(stationIndex, platformIndex, "unload");
    } else {
      setPlatformMode(stationIndex, platformIndex, "load");
    }
  };

  const setPlatformMode = (
    stationIndex: number,
    platformIndex: number,
    mode: TMPlatformMode,
  ) => {
    modified.value = true;
    if (!project.value) return;
    project.value.train_stations[stationIndex].platforms[platformIndex].mode =
      mode;
  };

  const addPlatform = (stationIndex: number) => {
    modified.value = true;
    if (project.value === null) {
      throw new Error("A project hasn't be loaded yet.");
    }

    if (stationIndex >= project.value.train_stations.length) {
      throw new Error(
        "Adding a platform to a station that does not exist in the current project",
      );
    }

    project.value?.train_stations[stationIndex].platforms.push({
      items: [],
      mode: "load",
    });
  };

  const removePlatform = (stationIndex: number, platformIndex: number) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex,
      1,
    );
  };

  const addPlatformItem = (
    stationIndex: number,
    platformIndex: number,
    item: TMPlatformItem,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].items.push(item);
  };

  const removePlatformItem = (
    stationIndex: number,
    platformIndex: number,
    itemIndex: number,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].items.splice(itemIndex, 1);
  };

  const resetModifiedState = () => {
    modified.value = false;
  };

  const movePlatformUp = (stationIndex: number, platformIndex: number) => {
    if (platformIndex == 0) {
      return;
    }

    const platform =
      project.value?.train_stations[stationIndex].platforms[platformIndex];

    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex,
      1,
    );
    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex - 1,
      0,
      platform,
    );
    modified.value = true;
  };

  const movePlatformDown = (stationIndex: number, platformIndex: number) => {
    if (
      platformIndex >=
      project.value?.train_stations[stationIndex].platforms.length - 1
    ) {
      return;
    }

    const platform =
      project.value?.train_stations[stationIndex].platforms[platformIndex];

    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex,
      1,
    );
    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex + 1,
      0,
      platform,
    );
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
    removePlatformItem,
    resetModifiedState,
    setPlatformMode,
    togglePlatformMode,
    movePlatformUp,
    movePlatformDown,
  };
});
