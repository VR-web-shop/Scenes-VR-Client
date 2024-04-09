<template>
    <div class="flex items-center justify-center gap-3">
        <router-link v-for="product in products" :key="product.uuid" :to="`/product/${product.uuid}`">
            <div class="text-white p-3 rounded-md bg-blue-500">
                <p>{{ product.name }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { useSceneSDK } from '../../composables/useScenesSDK.js';
import { ref, onBeforeMount } from 'vue';

const names = ['USB 64GB', 'USB 128GB', 'USB 256GB']
const { sdk } = useSceneSDK();
const products = ref([]);
onBeforeMount(async () => {
    const { rows: rows1 } = await sdk.api.ProductController.findAll({limit: 100, where: { name: names[0]}});
    const { rows: rows2 } = await sdk.api.ProductController.findAll({limit: 100, where: { name: names[1]}});
    const { rows: rows3 } = await sdk.api.ProductController.findAll({limit: 100, where: { name: names[2]}});
    const rows = [...rows1, ...rows2, ...rows3]
    products.value = rows;
});
</script>
