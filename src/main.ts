import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import moment from "moment";
import "moment/locale/es"; // Ajusta el locale según tu preferencia

moment.locale("es"); // Configura el locale globalmente

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
