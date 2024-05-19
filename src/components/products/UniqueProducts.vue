<template>
    <p class="font-bold text-center text-xs uppercase">
        Over {{ noOfProducts }} unique products available!
    </p>
</template>

<script setup>
import { useSceneSDK } from '../../composables/useScenesSDK.js';
import { ref, onBeforeMount } from 'vue';

const { sdk } = useSceneSDK();
const noOfProducts = ref(0);
onBeforeMount(async () => {
    const { count } = await sdk.Product.findAll(1, 100);
    noOfProducts.value = count;
});
</script>
