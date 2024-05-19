<template>
    <div v-if="product" class="mt-28 p-3 flex items-center justify-center">
        <Product :product="product" />
    </div>
</template>

<script setup>
import Product from '../components/products/Product.vue';
import { useSceneSDK } from '../composables/useScenesSDK.js';
import { router } from '../router.js';
import { ref, onBeforeMount } from 'vue';

const { sdk } = useSceneSDK();
const client_side_uuid = router.currentRoute.value.params.client_side_uuid;
const product = ref(null);

onBeforeMount(async () => {
    product.value = await sdk.Product.find( client_side_uuid );
    console.log(product.value);
});
</script>