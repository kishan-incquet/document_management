<template>
  <v-app id="app">
    <v-main>
      <docDashboard />
    </v-main>
  </v-app>
</template>

<script>
import docDashboard from './components/dashboard.vue';


export default {
  name: 'App',
  components: {
    "docDashboard": docDashboard
  }
}
</script>