import { createPinia } from "pinia";
import { createApp } from "vue";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { addIcons } from "oh-vue-icons";
import { IoTrainSharp, BiDownload, BiUpload } from "oh-vue-icons/icons";
import { MdInputTwotone, MdOutputTwotone } from "oh-vue-icons/icons";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";
import "./sass/main.css";
import router from "./router";

const pinia = createPinia();
addIcons(IoTrainSharp, BiDownload, BiUpload, MdInputTwotone, MdOutputTwotone);
const app = createApp(App);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.use(PrimeVue, { theme: "none" });
app.directive("tooltip", Tooltip);
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");
