<template>
    <div v-if="productOrder">
        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <p class="font-bold uppercase text-xs mb-3">Personal Information</p>

            <div class="flex items-center justify-between">
                <p class="font-bold">Name:</p>
                <p>{{ productOrder.name }}</p>
            </div>

            <div class="flex items-center justify-between">
                <p class="font-bold">Email:</p>
                <p>{{ productOrder.email }}</p>
            </div>

            <div class="flex items-center justify-between">
                <p class="font-bold">Address:</p>
                <p>{{ productOrder.address }}</p>
            </div>

            <div class="flex items-center justify-between">
                <p class="font-bold">City:</p>
                <p>{{ productOrder.city }}</p>
            </div>

            <div class="flex items-center justify-between">
                <p class="font-bold">Country:</p>
                <p>{{ productOrder.country }}</p>
            </div>

            <div class="flex items-center justify-between">
                <p class="font-bold">Postal Code:</p>
                <p>{{ productOrder.postal_code }}</p>
            </div>
        </div>

        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <p class="font-bold uppercase text-xs mb-3">Delivery Information</p>

            <div class="flex justify-between">
                <p class="font-bold">Delivery Option:</p>
                <div class="text-right">
                    <p>{{ deliveryOption.name }}</p>
                    <p>{{ deliveryOption.price }}{{ valuta }}</p>
                </div>
            </div>
        </div>

        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <p class="font-bold uppercase text-xs mb-3">Payment Information</p>

            <div class="flex items-center justify-between">
                <p class="font-bold">Payment Option:</p>
                <div class="text-right">
                    <p>{{ paymentOption.name }}</p>
                    <p>{{ paymentOption.price }}{{ valuta }}</p>
                </div>
            </div>
        </div>

        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <CheckoutProducts />

            <div class="flex justify-between items-center gap-3 mt-3">
                <div class="font-bold">Total Price:</div>
                <div class="font-bold">{{ totalPrice }}{{ valuta }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CheckoutProducts from './CheckoutProducts.vue';
import { useProductsSDK } from '../../composables/useProductsSDK.js';
import { useCheckout } from '../../composables/useCheckout.js';
import { computed } from 'vue'

const productsCtrl = useProductsSDK()
const checkoutCtrl = useCheckout()
const valuta = computed(() => productsCtrl.valuta.value?.short)
const productOrder = computed(() => checkoutCtrl.productOrder.value)
const deliveryOption = computed(() => checkoutCtrl.deliveryOptions.value.find(option => option.client_side_uuid === checkoutCtrl.productOrder.value.deliver_option_client_side_uuid))
const paymentOption = computed(() => checkoutCtrl.paymentOptions.value.find(option => option.client_side_uuid === checkoutCtrl.productOrder.value.payment_option_client_side_uuid))

const totalPrice = computed(() => {
    let price = checkoutCtrl.products.value.reduce((acc, data) => acc + (data.product.price * data.entities.length), 0)
    price += deliveryOption.value.price
    price += paymentOption.value.price
    return price
})
</script>