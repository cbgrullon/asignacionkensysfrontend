import Vue from 'vue';
import App from './App';
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false
Vue.use(VueSweetalert2);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
