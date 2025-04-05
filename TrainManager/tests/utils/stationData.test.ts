import { expect, test } from "vitest";

import { TMTrainStation } from "@/api/types";
import { trainStationItemTotals, trainStationPlatformItemTotals } from "@/utils/stationData";
const trainStationOne: TMTrainStation = {
  station_name: "station one",
  platforms: [
    // platform 1
    {
      mode: "load",
      items: [
        {
          item_id: "a",
          rate: 100,
        },
      ],
    },

    // platform 2
    {
      mode: "unload",
      items: [
        {
          item_id: "b",
          rate: 100,
        },
      ],
    },
  ],
};

const trainStationTwo: TMTrainStation = {
  station_name: "station two",
  platforms: [
    //platform 1
    {
      mode: "load",
      items: [
        {
          item_id: "c",
          rate: 50,
        },
      ],
    },

    // platform 2
    {
      mode: "load",
      items: [
        {
          item_id: "b",
          rate: 25,
        },
      ],
    },
  ],
};

test("overall totals", () => {
  const results = trainStationItemTotals([trainStationOne, trainStationTwo]);

  expect(results.available.length).toBe(3);
  expect(results.load.length).toBe(3);
  expect(results.unload.length).toBe(1);
});

test("platform totals", () => {
  const results = trainStationPlatformItemTotals([trainStationOne, trainStationTwo]);

  expect(results.length).toBe(2);
  expect(results[0].available.length).toBe(2);
  expect(results[0].load.length).toBe(2);
  expect(results[0].available[0].rate).toBe(100);
  expect(results[0].available[1].rate).toBe(50);
  expect(results[1].available[0].rate).toBe(-75);

  expect(results[1].available.length).toBe(1);

  expect(results[1].load.length).toBe(1);
});
