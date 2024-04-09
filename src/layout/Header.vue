<template>
    <header class="fixed top-0 left-0 right-0" style="z-index: 1;">
        <div class="bg-orange-500 p-1 text-white w-full flex items-center justify-center">
            <UniqueProducts />
        </div>
        <div class="bg-black shadow-md p-3 text-white w-full flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800">
            <router-link to="/" class="flex items-center justify-between gap-3">
                <h1 class="font-bold">Electronics Hub VR</h1>
            </router-link>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-1">
                <router-link v-if="!isHome" to="/" class="text-white px-5 py-1 rounded-md bg-blue-500 block text-center">Home</router-link>
                <StartVRButton v-if="isHome" />
                <ShoppingBasket />
                <router-link to="/products" class="text-white px-5 py-1 rounded-md bg-blue-500 block text-center">Products</router-link>
                <div class="w-1 bg-gray-500/50 h-8 rounded-md ml-1 mr-1 hidden md:block">
                </div>
                <router-link to="/contact" class="text-white px-5 py-1 rounded-md bg-blue-500 block text-center">Contact</router-link>
                <router-link to="/about" class="text-white px-5 py-1 rounded-md bg-blue-500 block text-center">About</router-link>
            </div>
        </div>
    </header>
</template>

<script setup>
import StartVRButton from '../components/VR/StartVRButton.vue';
import UniqueProducts from '../components/products/UniqueProducts.vue';
import ShoppingBasket from '../components/shopping-basket/ShoppingBasket.vue';
import { computed } from 'vue';
import { router } from '../router';
const isHome = computed(() => router.currentRoute.value.name === 'Home');
</script>
