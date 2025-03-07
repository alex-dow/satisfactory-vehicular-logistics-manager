import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import { clientFetch } from "./useClient";

import type { TMProject } from "./types";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await clientFetch("/api/projects");
      if (res.status >= 400) {
        throw new Error("Failed to load list of users");
      }
      const users = await res.json();
      return users as TMProject[];
    },
  });
};

export const useProject = (projectId: number) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await clientFetch(
        "/api/projects/" + encodeURIComponent(projectId),
      );
      if (res.status >= 400) {
        throw new Error(`Failed to fetch project #${projectId}`);
      }
      const project = await res.json();

      return project as TMProject;
    },
    refetchOnMount: false,
  });
};

export const useSaveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: TMProject): Promise<TMProject> => {
      const res = await clientFetch(
        "/api/projects/" + encodeURIComponent(project.id),
        {
          method: "put",
          body: JSON.stringify(project),
          headers: {
            "content-type": "application/json",
          },
        },
      );
      if (res.status >= 400) {
        throw new Error("Failed to create project");
      }
      const updatedProject = await res.json();
      return updatedProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectName: string): Promise<TMProject> => {
      const res = await clientFetch("/api/projects", {
        method: "post",
        body: JSON.stringify({ projectName }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.status >= 400) {
        throw new Error("Failed to create project");
      }
      const project = await res.json();
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: number) => {
      const res = await clientFetch(
        "/api/projects/" + encodeURIComponent(projectId),
        {
          method: "delete",
        },
      );
      if (res.status >= 400) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
