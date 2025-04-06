import { createRouter, createWebHistory } from "vue-router";

/*
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
*/

const LoginLayout = () => import("./layouts/LoginLayout.vue");
const MainLayout = () => import("./layouts/MainLayout.vue");
const ProjectLayout = () => import("./layouts/ProjectLayout.vue");
const CreateUserPage = () => import("./pages/CreateUserPage.vue");
const HomePage = () => import("./pages/HomePage.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const ProfilePage = () => import("./pages/ProfilePage.vue");
const ProjectPage = () => import("./pages/ProjectPage.vue");
const ProjectsPage = () => import("./pages/ProjectsPage.vue");
const TrainStationPage = () => import("./pages/TrainStationPage.vue");
const TrainConsistPage = () => import("./pages/TrainConsistPage.vue");

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
            path: "train-stations/:itemId",
            component: TrainStationPage,
            name: "train-station",
          },
          {
            path: "train-consists/:itemId",
            component: TrainConsistPage,
            name: "train-consist",
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: LoginPage,
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
