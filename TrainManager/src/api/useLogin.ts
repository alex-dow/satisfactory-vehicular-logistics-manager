import { useMutation } from "@tanstack/vue-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (user: { username: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "post",
        body: JSON.stringify(user),
        headers: {
          "content-type": "application/json",
        },
      });

      if (res.status >= 400) {
        throw new Error("Invalid username or password");
      }
    },
  });
};
