<template>
    <div class="flex items-center justify-between gap-3 mb-3">
        <div>
            <label class="font-bold text-xs uppercase block mb-1">Quantity: </label>
            <input
                v-model="quantity"
                :min="min"
                :max="max" 
                class="w-20 rounded-md border border-gray-300 text-center" 
                type="number" 
            />
        </div>

        <button @click="addToCart" class="text-white p-3 rounded-md bg-blue-500 text-sm">
            Add to cart
        </button>
    </div>
</template>

<script setup>
import { useShoppingCart } from '../../composables/useShoppingCart.js';
import { useToast } from '../../composables/useToast.js';
import { useShoppingCartSDK } from '../../composables/useShoppingCartSDK.js';
import { ref, defineEmits } from 'vue';
const emits = defineEmits(['addedToCart']);
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const min = 1;
const max = props.product.product_entities ? props.product.product_entities.length : 1;
const quantity = ref(min);
const shoppingCartSDK = useShoppingCartSDK();
const shoppingCart = useShoppingCart();
const toast = useToast();

const addToCart = async () => {
    const entities = props.product.product_entities 
        ? props.product.product_entities
        : [];

    const productEntities = entities.slice(0, quantity.value);
    await shoppingCartSDK.addProductToCart(productEntities);
    await shoppingCart.reloadCart();
    toast.add('Product added to cart', 5000, 'success');
    emits('addedToCart', productEntities);
}

</script>