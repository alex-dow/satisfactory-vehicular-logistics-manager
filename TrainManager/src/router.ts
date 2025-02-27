import { createRouter, createWebHistory } from "vue-router";

import LoginLayout from "./layouts/LoginLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
import ProjectLayout from "./layouts/ProjectLayout.vue";
import CreateUserPage from "./pages/CreateUserPage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import ProjectPage from "./pages/ProjectPage.vue";
import ProjectsPage from "./pages/ProjectsPage.vue";
import TrainStation from "./pages/TrainStation.vue";
import TrainStationsListPage from "./pages/TrainStationsList.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: HomePage, name: "home" },
      { path: "/projects", component: ProjectsPage, name: "projects" },
      {
        path: "/projects/:projectId",
        component: ProjectLayout,
        props: true,
        children: [
          {
            path: "",
            component: ProjectPage,
            props: true,
            name: "project",
          },
          {
            path: "train-stations",
            component: TrainStationsListPage,
            props: true,
            name: "train-stations",
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: LoginLayout,
    children: [
      {
        path: "",
        component: LoginPage,
        name: "login",
      },
    ],
  },
  {
    path: "/create-user",
    component: LoginLayout,
    children: [
      {
        path: "",
        component: CreateUserPage,
        name: "create-user",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
