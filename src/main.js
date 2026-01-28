import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { msalInstance } from "@/auth/msal";

async function bootstrap() {
    // Initialize MSAL and handle redirect response (if returning from login)
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();

    const app = createApp(App);
    app.use(router);
    app.mount("#app");
}

bootstrap();
