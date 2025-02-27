import { defineStore } from "pinia";
import { ref } from "vue";

import { TMProject } from "@/api/types";
import { useProject } from "@/api/useProjects";

export const useProjectStore = defineStore("current-project", () => {
  const { data: currentProject } = useProject(1);

  const selectProject = async (projectId: number) => {};
});
