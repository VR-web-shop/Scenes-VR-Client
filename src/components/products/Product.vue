<template>
    <div class="relative pt-6">
        <div class="absolute top-1 right-1 text-sm text-gray-600">
            <div v-if="availableForPurchase.length > 0">
                Quantity: {{ availableForPurchase.length }}
            </div>
            <div v-else class="text-red-500">
                Out of stock
            </div>
        </div>

        <img :src="product.thumbnail_source" class="w-64" />

        <div class="text-xl text-center font-bold mb-1">
            {{ product.name }}
        </div>

        <div class="text-sm text-center border-b border-gray-600 pb-6 mb-6">
            {{ product.description }}
        </div>

        <AddToBasket :product="product" @addedToCart="addedToCart" />
    </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import AddToBasket from '../shopping-basket/AddToBasket.vue';
const emits = defineEmits(['addedToCart']);
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})
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