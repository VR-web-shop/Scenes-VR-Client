<template>
    <div>
        <div class="px-10 py-24 bg-black text-white">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Find all the gear you need
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    We have a wide range of products to suit your needs. Find the right gear for you below.
                </p>

                <div class="flex items-center justify-center px-10">

                    <img src="/images/ProductsVariation2.png" alt="Products" class="w-full scale-150" />

                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-white text-black">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Find all the gear you need
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    We have a wide range of products to suit your needs. Find the right gear for you below.
                </p>

                <Paginator :findAllMethod="sdk.Product.findAll" :limit="10">
                    <template #empty>
                        <div class="text-center">
                            <p>No products found</p>
                        </div>
                    </template>

                    <template #default="{ entities }">
                        <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                            <div v-for="product in entities" :key="product.client_side_uuid"
                                class="border border-gray-300 rounded-md p-8 bg-gray-300">
                                <div>
                                    <Product :product="product" />

                                    <div>
                                        <router-link :to="{ name: 'Product', params: { client_side_uuid: product.client_side_uuid } }"  class="text-white px-5 py-1 rounded-md w-full bg-blue-500 block text-center text-sm">
                                            View product
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import Product from '../components/products/Product.vue';
import Paginator from '../components/PaginatorScenes.vue';
import { useSceneSDK } from '../composables/useScenesSDK.js';
const { sdk } = useSceneSDK();
</script>