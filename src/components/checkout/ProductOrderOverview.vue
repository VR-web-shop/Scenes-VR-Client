<template>
    <div>
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
                    <p>{{ productOrder.DeliverOption.name }}</p>
                    <p>{{ productOrder.DeliverOption.price }}DKK</p>
                </div>
            </div>
        </div>

        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <p class="font-bold uppercase text-xs mb-3">Payment Information</p>

            <div class="flex items-center justify-between">
                <p class="font-bold">Payment Option:</p>
                <div class="text-right">
                    <p>{{ productOrder.PaymentOption.name }}</p>
                    <p>{{ productOrder.PaymentOption.price }}DKK</p>
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
import { useCheckout } from '../../composables/useCheckout.js';
import { computed } from 'vue'

const checkoutCtrl = useCheckout()
const valuta = computed(() => checkoutCtrl.valuta.value)
const productOrder = computed(() => checkoutCtrl.productOrder.value)
const deliveryOptions = computed(() => checkoutCtrl.deliveryOptions.value)
const paymentOptions = computed(() => checkoutCtrl.paymentOptions.value)
const deliveryOption = computed(() => checkoutCtrl.productOrder.value.DeliverOption.name)
const paymentOption = computed(() => checkoutCtrl.productOrder.value.PaymentOption.name)

const totalPrice = computed(() => {
    let price = checkoutCtrl.products.value.reduce((acc, data) => acc + (data.product.price * data.entities.length), 0)
    price += deliveryOptions.value.find(option => option.name === deliveryOption.value).price
    price += paymentOptions.value.find(option => option.name === paymentOption.value).price
    return price
})
</script>