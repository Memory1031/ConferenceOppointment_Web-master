// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/interceptors'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router'

Vue.use(Vant);

Vue.use(ViewUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
