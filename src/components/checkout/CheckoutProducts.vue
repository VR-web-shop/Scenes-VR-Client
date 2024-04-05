<template>
    <div>
        <p class="font-bold uppercase text-xs mb-3">Products</p>
        <div v-if="checkoutCtrl.products.value.length === 0">
            No products in the cart.
        </div>

        <div v-for="data in checkoutCtrl.products.value" :key="data.product.uuid">
            <div class="flex items-start gap-3 mb-3">
                <img :src="data.product.thumbnail_source" class="w-10 h-10 border border-gray-300 rounded-md" />
                <div>
                    <div class="font-bold">{{ data.product.name }}</div>
                    <div class="text-sm text-gray-500 mb-3">{{ data.product.description }}</div>

                    <div class="text-xs text-center">
                        <div class="flex justify-center items-center gap-1">
                            <div class="font-bold">{{ data.product.price }}{{ valuta }}</div>
                            <div class="font-bold">x</div>
                            <div class="font-bold">{{ data.entities.length }}</div>
                            <div class="font-bold">=</div>
                            <div class="font-bold">{{ data.product.price * data.entities.length }}{{ valuta }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useProductsSDK } from '../../composables/useProductsSDK.js';
import { useCheckout } from '../../composables/useCheckout.js';
import { computed } from 'vue'

const checkoutCtrl = useCheckout()
const productsSDK = useProductsSDK()
const valuta = computed(() => productsSDK.valuta.value?.short)
</script>