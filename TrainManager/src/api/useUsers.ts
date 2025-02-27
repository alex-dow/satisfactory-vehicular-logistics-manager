import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import { clientFetch } from "./useClient";

import type { TMUser } from "./types";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await clientFetch("/api/users");
      if (res.status >= 400) {
        throw new Error("Failed to load list of users");
      }
      const users = await res.json();
      return users as TMUser[];
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser: {
      username: string;
      password: string;
    }): Promise<TMUser> => {
      const res = await clientFetch("/api/users", {
        method: "post",
        body: JSON.stringify(newUser),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.status == 409) {
        throw new Error("This username is already taken.");
      } else if (res.status >= 400) {
        throw new Error('Failed to create user "' + newUser.username + '"');
      }
      const user = await res.json();
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch("/api/users/" + encodeURIComponent(userId));
      if (res.status >= 400) {
        throw new Error('Failed to delete user "' + userId + '"');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
