import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from "vue-axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.config.productionTip = false
Vue.use(VueAxios, axios);
Vue.component("Loading", Loading);
new Vue({
  render: h => h(App),
}).$mount('#app')
