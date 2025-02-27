import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";

import type { IItemSchema } from "@/satisfactory/schema/IItemSchema";

import { type BasicItem } from "@/satisfactory/types";

/**
 * Provides all satisfactory data and utils for refreshing this data
 */
export const useSatisfactoryStore = defineStore("satisfactory-store", () => {
  const items = shallowRef<Record<string, IItemSchema> | null>(null);

  const refresh = async () => {
    const res = await fetch("/data/data1.0.json");
    const data = await res.json();
    items.value = data.items;
  };

  const basicItems = computed<BasicItem[]>(() => {
    if (items.value == null) {
      return [];
    }

    return Object.values(items.value)
      .map((item) => {
        return { id: item.slug, name: item.name, icon: item.icon };
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
  });

  return { items, refresh, basicItems };
});
