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
const uuid = router.currentRoute.value.params.uuid;
const product = ref(null);

onBeforeMount(async () => {
    product.value = await sdk.api.ProductController.find({ uuid }, {
        include: 'product_entities'
    });
});
</script>