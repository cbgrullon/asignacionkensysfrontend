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
axios.defaults.baseURL = 'https://localhost:7089/api/';
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>