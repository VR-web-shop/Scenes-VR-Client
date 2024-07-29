<template>
    <div class="grid grid-cols-2 gap-6 px-10">

        <div v-for="product in products" :key="product.uuid" class="bg-white text-black p-3 rounded-md">
            <Product :product="product" @addedToCart="onAddedToCart" />
        </div>

    </div>
</template>

<script setup>
import Product from './Product.vue';
import { useSceneSDK } from '../../composables/useScenesSDK.js';
import { useProductsSDK } from '../../composables/useProductsSDK.js';
import { ref, computed, onBeforeMount } from 'vue';

const productsSDK = useProductsSDK()
const valuta = computed(() => productsSDK.valuta.value?.short)

const { sdk } = useSceneSDK();
const products = ref([]);
const reloadProducts = async () => {
    const { count, rows } = await sdk.Product.findAll(1, 1000);

    if (count === 0) return
    const noOfProducts = 2
    const r = []
    const l = rows.length
    const n = l > noOfProducts ? noOfProducts : l
    const randomStartPoint = Math.floor(Math.random() * (l - n))
    for (let i = 0; i < n; i++) {
        r[i] = rows[randomStartPoint + i]
    }

    products.value = r;
}

const onAddedToCart = async (productEntities) => {
    const uniqueProductUUIDs = productEntities.map(pe => pe.product_uuid)
    for (const product of products.value) {
        if (uniqueProductUUIDs.includes(product.client_side_uuid)) {
            const newProduct = await sdk.Product.find(product.client_side_uuid)
            const index = products.value.findIndex(p => p.client_side_uuid === product.client_side_uuid)
            products.value[index] = newProduct
            break
        }
    }
}

onBeforeMount(reloadProducts);
</script>
