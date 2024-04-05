import Vue from 'vue';
import Router from 'vue-router';
import PermisoList from '@/components/PermisoList';
import PermisoUpsert from '@/components/PermisoUpsert';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'permiso-list',
      component: PermisoList
    },
    {
      path: '/Upsert/:id',
      name: 'permiso-upsert',
      component: PermisoUpsert
    }
  ]
})
