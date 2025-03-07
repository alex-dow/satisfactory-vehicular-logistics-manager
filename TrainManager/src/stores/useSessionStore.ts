import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { TMUser } from "@/api/types";

export const useSessionStore = defineStore("session", () => {
  const currentUsername = ref<string | null>(null);
  const currentUserId = ref<number | null>(null);

  const isLoggedIn = computed(() => {
    return currentUserId.value !== null && currentUsername.value !== null;
  });

  const verify = async () => {
    const res = await fetch("/api/whoami");
    if (res.status >= 400) {
      throw new Error("Not authenticated");
    }
    const user = (await res.json()) as TMUser;
    currentUserId.value = user.id;
    currentUsername.value = user.username;
  };

  const logout = async () => {
    const logoutRes = await fetch("/api/logout", { method: "post" });
    if (logoutRes.status >= 400) {
      throw new Error("Failed to logout");
    }

    currentUserId.value = null;
    currentUsername.value = null;
  };

  const login = async (username: string, password: string) => {
    const loginRes = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify({ username, password }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (loginRes.status >= 400) {
      throw new Error("Invalid username or password");
    }

    const whoamiRes = await fetch("/api/whoami");
    if (whoamiRes.status >= 400) {
      throw new Error("Invalid username or password");
    }

    const whoami = (await whoamiRes.json()) as TMUser;

    currentUsername.value = whoami.username;
    currentUserId.value = whoami.id;
  };

  return { currentUsername, currentUserId, login, logout, verify, isLoggedIn };
});
