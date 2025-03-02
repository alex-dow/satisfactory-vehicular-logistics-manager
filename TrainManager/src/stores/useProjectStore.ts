import { defineStore } from "pinia";
import { ref, watch } from "vue";

import type { TMPlatform, TMPlatformItem, TMProject } from "@/api/types";

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
      inputs: [],
      outputs: [],
    });
  };

  const removePlatform = (stationIndex: number, platformIndex: number) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms.splice(
      platformIndex,
      1,
    );
  };

  const addPlatformInput = (
    stationIndex: number,
    platformIndex: number,
    item: TMPlatformItem,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].inputs.push(item);
  };

  const addPlatformOutput = (
    stationIndex: number,
    platformIndex: number,
    item: TMPlatformItem,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].outputs.push(item);
  };

  const removePlatformInput = (
    stationIndex: number,
    platformIndex: number,
    itemIndex: number,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].inputs.splice(itemIndex, 1);
  };

  const removePlatformOutput = (
    stationIndex: number,
    platformIndex: number,
    itemIndex: number,
  ) => {
    modified.value = true;
    project.value?.train_stations[stationIndex].platforms[
      platformIndex
    ].outputs.splice(itemIndex, 1);
  };

  return {
    project,
    modified,
    setCurrentProject,
    addPlatform,
    addTrainStation,
    removeTrainStation,
    removePlatform,
    addPlatformInput,
    addPlatformOutput,
    removePlatformInput,
    removePlatformOutput,
  };
});
