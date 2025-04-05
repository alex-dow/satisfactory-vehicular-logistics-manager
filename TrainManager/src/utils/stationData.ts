import type { TMPlatformItem, TMPlatformMode, TMTrainStation } from "@/api/types";

export type ItemTotals = Record<TMPlatformMode, TMPlatformItem[]> & {
  available: TMPlatformItem[];
};

export interface ItemIndex {
  available: Record<string, number>;
  load: Record<string, number>;
  unload: Record<string, number>;
}

export const trainStationPlatformItemTotals = (trainStations: TMTrainStation[]) => {
  const platformItemIndices: ItemIndex[] = [];
  const platformItems: ItemTotals[] = [];

  trainStations.forEach((trainStation) => {
    trainStation.platforms.forEach((platform, platformIndex) => {
      if (platformIndex === platformItems.length) {
        platformItems.push({
          available: [],
          load: [],
          unload: [],
        });
        platformItemIndices.push({
          available: {},
          load: {},
          unload: {},
        });
      }

      platform.items.forEach((item) => {
        if (item.item_id in platformItemIndices[platformIndex][platform.mode]) {
          const itemIndex = platformItemIndices[platformIndex][platform.mode][item.item_id];

          platformItems[platformIndex][platform.mode][itemIndex].rate += item.rate;
        } else {
          const itemIndex = platformItems[platformIndex][platform.mode].length;
          platformItemIndices[platformIndex][platform.mode][item.item_id] = itemIndex;

          platformItems[platformIndex][platform.mode].push({ item_id: item.item_id, rate: item.rate });
        }

        if (item.item_id in platformItemIndices[platformIndex]["available"]) {
          const availItemIndex = platformItemIndices[platformIndex]["available"][item.item_id];

          if (platform.mode === "load") {
            platformItems[platformIndex]["available"][availItemIndex].rate += item.rate;
          } else {
            platformItems[platformIndex]["available"][availItemIndex].rate -= item.rate;
          }
        } else {
          const availItemIndex = platformItems[platformIndex]["available"].length;
          platformItemIndices[platformIndex]["available"][item.item_id] = availItemIndex;

          const rate = platform.mode === "load" ? item.rate : -item.rate;
          platformItems[platformIndex]["available"].push({ item_id: item.item_id, rate });
        }
      });
    });
  });
  return platformItems;
};

export const trainStationItemTotals = (trainStations: TMTrainStation[]) => {
  const itemIndices: ItemIndex = { available: {}, load: {}, unload: {} };
  const items: ItemTotals = {
    available: [],
    load: [],
    unload: [],
  };

  trainStations.forEach((trainStation) => {
    trainStation.platforms.forEach((platform) => {
      platform.items.forEach((item) => {
        if (item.item_id in itemIndices[platform.mode]) {
          const itemIndex = itemIndices[platform.mode][item.item_id];
          items[platform.mode][itemIndex].rate += item.rate;
        } else {
          const itemIndex = items[platform.mode].length;
          itemIndices[platform.mode][item.item_id] = itemIndex;
          items[platform.mode].push({ item_id: item.item_id, rate: item.rate });
        }

        if (item.item_id in itemIndices["available"]) {
          const availItemIndex = itemIndices["available"][item.item_id];

          if (platform.mode === "load") {
            items["available"][availItemIndex].rate += item.rate;
          } else {
            items["available"][availItemIndex].rate -= item.rate;
          }
        } else {
          const itemIndex = items["available"].length;
          itemIndices["available"][item.item_id] = itemIndex;

          if (platform.mode === "load") {
            items["available"].push({ ...item, rate: item.rate });
          } else {
            items["available"].push({ ...item, rate: -item.rate });
          }
        }
      });
    });
  });
  return items;
};

/*
const getMappedItems = (trainStation: TMTrainStation) => {
  const lItems: Record<string, number> = {};
  const aItems: Record<string, number> = {};
  const uItems: Record<string, number> = {};

  trainStation.platforms.forEach((platform) => {
    if (platform.mode === "load") {
      // output
      platform.items.forEach((item) => {
        if (!lItems[item.item_id]) {
          lItems[item.item_id] = item.rate;
        } else {
          lItems[item.item_id] += item.rate;
        }

        if (!aItems[item.item_id]) {
          aItems[item.item_id] = item.rate;
        } else {
          aItems[item.item_id] += item.rate;
        }
      });
    } else if (platform.mode === "unload") {
      // input
      platform.items.forEach((item) => {
        if (!uItems[item.item_id]) {
          uItems[item.item_id] = item.rate;
        } else {
          uItems[item.item_id] += item.rate;
        }

        if (!aItems[item.item_id]) {
          aItems[item.item_id] = -item.rate;
        } else {
          aItems[item.item_id] -= item.rate;
        }
      });
    }
  });

  return [lItems, uItems, aItems];
};
*/

const getInputItemsByPlatform = (trainStation: TMTrainStation) => {
  const platforms: Record<number, Record<string, number>> = {};
  trainStation.platforms.forEach((value, idx) => {
    if (!platforms[idx]) {
      platforms[idx] = {};
    }
    value.items.forEach((item) => {
      if (!platforms[idx][item.item_id]) {
        platforms[idx][item.item_id] = item.rate;
      } else {
        platforms[idx][item.item_id] += item.rate;
      }
    });
  });

  return platforms;
};
