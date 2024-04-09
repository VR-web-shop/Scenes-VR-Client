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

        <button @click="removeProduct" class="text-white p-3 rounded-md bg-red-500 text-sm">
            Remove from cart
        </button>
    </div>
</template>

<script setup>
import { useShoppingCart } from '../../composables/useShoppingCart.js';
import { useShoppingCartSDK } from '../../composables/useShoppingCartSDK.js';
import { useToast } from '../../composables/useToast.js';
import { ref } from 'vue';
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const min = 1;
const max = props.product.cartProductEntities.length;
const quantity = ref(min);
const shoppingCartSDK = useShoppingCartSDK();
const shoppingCart = useShoppingCart();
const toast = useToast();

const removeProduct = async () => {
    let productEntities = props.product.cartProductEntities.map(p => p.ProductEntity)
    productEntities = productEntities.slice(0, quantity.value);
    await shoppingCartSDK.removeProductFromCart(productEntities)
    await shoppingCart.reloadCart()
    toast.add('Product removed from cart', 5000, 'success');
}

</script>