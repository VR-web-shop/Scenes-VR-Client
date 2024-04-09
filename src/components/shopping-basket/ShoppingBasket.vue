<template>
    <div>
        <div class="flex items-center justify-between gap-3">
            <button @click="toggle" class="text-white px-5 py-1 rounded-md w-full block text-center"
                :class="showBasket ? 'bg-red-500' : 'bg-blue-500'">
                {{ showBasket ? 'Close Cart' : 'Cart (' + count + ' items)' }}
            </button>

            <div v-if="showBasket"
                class="fixed top-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden w-64 h-full bg-white text-black shadow-md p-5"
                style="z-index: 9998;">
                <h2 class="text-2xl font-bold mb-3">Shopping Cart</h2>
                <div v-if="products.length === 0">
                    Your cart is empty. Add products to continue.
                </div>

                <div v-if="products.length > 0" class="flex flex-col gap-3">
                    <div v-for="product in products" :key="product.uuid" class="flex items-center gap-3">
                        <div class="w-16 h-16 bg-gray-300 rounded-md">
                            <img :src="product.thumbnail_source" alt="Product image"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 class="font-bold">{{ product.name }}</h3>
                            <p>{{ product.description }}</p>
                            <p>Quantity: {{ product.quantity }}</p>
                            <p>Price: {{ product.price }}</p>

                            <RemoveFromBasket :product="product" /> 
                        </div>
                    </div>
                </div>

                <div class="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                    <button v-if="products.length > 0" @click="startCheckout"
                        class="text-white px-5 py-1 rounded-md w-full bg-blue-500">
                        Start Checkout
                    </button>

                    <button @click="toggle" class="text-white px-5 py-1 rounded-md w-full"
                        :class="showBasket ? 'bg-red-500' : 'bg-blue-500'">
                        {{ showBasket ? 'Close' : 'Open' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import RemoveFromBasket from '../shopping-basket/RemoveFromBasket.vue';
import { useShoppingCart } from '../../composables/useShoppingCart.js';
import { computed, onMounted } from 'vue';

const shoppingCart = useShoppingCart();
const showBasket = computed(() => shoppingCart.showBasket.value);
const products = computed(() => shoppingCart.products.value);
const count = computed(() => shoppingCart.count.value);

const toggle = () => shoppingCart.toggle();
const startCheckout = () => shoppingCart.startCheckout();

onMounted(async () => await shoppingCart.reloadCart());
</script>