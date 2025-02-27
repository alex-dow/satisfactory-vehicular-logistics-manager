import { createPinia } from "pinia";
import { createApp } from "vue";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { addIcons } from "oh-vue-icons";
import { IoTrainSharp, BiDownload, BiUpload } from "oh-vue-icons/icons";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";
import "./sass/main.css";
import router from "./router";

const pinia = createPinia();
addIcons(IoTrainSharp, BiDownload, BiUpload);
const app = createApp(App);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.use(PrimeVue, { theme: "none" });
app.directive("tooltip", Tooltip);
app.use(ConfirmationService);
app.mount("#app");
