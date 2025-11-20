import { createApp } from "vue";

import App from "./App.vue";

import "./assets/globals.css";

const app = createApp(App);

app.config.warnHandler = (msg) => {
  console.warn("app.config.warn", msg);
};

app.config.errorHandler = (err) => {
  console.warn("app.config.error", err);
};

app.config.performance = true; // DEV-ONLY

app.mount("#root");
