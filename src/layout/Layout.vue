<script setup>
import Toast from '../components/Toast.vue';
import Footer from './Footer.vue';
</script>

<template>
    <div>
      <Toast />
      
      <router-view></router-view>
      <Footer />
    </div>
</template>
