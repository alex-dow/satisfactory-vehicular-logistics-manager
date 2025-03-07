import { createRouter, createWebHistory } from "vue-router";

import LoginLayout from "./layouts/LoginLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
import ProjectLayout from "./layouts/ProjectLayout.vue";
import CreateUserPage from "./pages/CreateUserPage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import ProjectPage from "./pages/ProjectPage.vue";
import ProjectsPage from "./pages/ProjectsPage.vue";
import TrainStationPage from "./pages/TrainStationPage.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: HomePage, name: "home" },
      { path: "/profile", component: ProfilePage, name: "profile" },
      { path: "/projects", component: ProjectsPage, name: "projects" },
      {
        path: "/projects/:projectId",
        component: ProjectLayout,
        children: [
          {
            path: "",
            component: ProjectPage,
            name: "project",
          },
          {
            path: "train-stations/:stationIndex",
            component: TrainStationPage,
            name: "train-station",
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
