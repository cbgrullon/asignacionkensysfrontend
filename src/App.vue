<template>
  <div id="app">
    <NavBar />
    <div class="container">
      <div style="padding-bottom: 4rem;"></div>
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './components/NavBar.vue';
import constants from './constants';
axios.defaults.baseURL = constants.apiUrl;
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>