import { createApp } from "vue"; // Vue 3 importieren
import App from "./App.vue"; // Haupt-App-Komponente importieren
import router from "./router"; // Router importieren

// Die Vue-App erstellen und den Router einbinden
createApp(App)
  .use(router) // Router aktivieren
  .mount("#app"); // App an das DOM binden
