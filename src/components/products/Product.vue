<template>
    <div class="relative border border-slate-300 p-6 shadow-md">
        <div class="relative flex justify-center border border-slate-300 p-6 mb-3 shadow-md">
            <div class="absolute top-0 right-0">
                <div v-if="availableForPurchase.length > 0" class="px-3 py-1 bg-green-500 text-green-100">
                    Quantity: {{ availableForPurchase.length }}
                </div>
                <div v-else class="px-3 py-1 bg-red-500 text-red-100">
                    Out of stock
                </div>
            </div>

            <img :src="product.thumbnail_source" class="w-64" />
        </div>

        <div class="p-6 mb-3">
            <div class="text-3xl text-center font-bold mb-3">
                {{ product.name }}
            </div>

            <div class="text-sm text-center text-md">
                {{ product.description }}
            </div>
        </div>

        <div class="px-3 py-1 bg-slate-100 text-slate-800 mb-3">
            {{ product.price }} {{ valuta }}
        </div>

        <div class="text-center">
            <AddToBasket :product="product" @addedToCart="addedToCart" />
        </div>

        <slot></slot>
    </div>
</template>

<script setup>
import { computed, defineEmits, onMounted } from 'vue';
import AddToBasket from '../shopping-basket/AddToBasket.vue';
import { useProductsSDK } from '../../composables/useProductsSDK';
const emits = defineEmits(['addedToCart']);
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})
const productsCtrl = useProductsSDK()
onMounted(async () => {
    await productsCtrl.start()
})
const valuta = computed(() => productsCtrl.valuta.value?.short)

const addedToCart = (productEntities) => {
    emits('addedToCart', productEntities);
}
const availableForPurchase = computed(() => {
    const a = []
    if (!props.product.product_entities) return a
    for (let i = 0; i < props.product.product_entities.length; i++) {
        if (props.product.product_entities[i].product_entity_state_name === 'AVAILABLE_FOR_PURCHASE') {
            a.push(props.product.product_entities[i])
        }
    }
    return a
})
</script>