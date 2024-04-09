<script setup>
import Toast from '../components/Toast.vue';
import CheckoutOverlay from '../components/CheckoutOverlay.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<template>
    <div>
      <Toast />
      <Header />
      <CheckoutOverlay />
      <router-view></router-view>
      <Footer />
    </div>
</template>
