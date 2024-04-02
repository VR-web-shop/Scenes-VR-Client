<template>
    <div>
        <div v-if="checkoutCtrl.show.value" class="h-full w-full bg-white rounded-md shadow-md p-3 w-64 overflow-y-auto">
            <h1 class="text-xl font-bold mb-1">
                Checkout
            </h1>

            <p class="text-gray-500 mb-3">
                Follow the instructions on the screen to complete your purchase.
            </p>

            <div v-if="step === 'overview'">
                <h2 class="text-md font-bold mb-1">
                    Products
                </h2>
                <div v-if="checkoutCtrl.products.value.length > 0">
                    <div class="border border-gray-300 p-3 rounded-md shadow-md" v-for="data in checkoutCtrl.products.value"
                        :key="data.product.uuid">
                        <div class="flex items-start gap-3 mb-3">
                            <img :src="data.product.thumbnail_source" class="w-10 h-10 border border-gray-300 rounded-md" />
                            <div>
                                <div class="font-bold">{{ data.product.name }}</div>
                                <div class="text-sm text-gray-500 mb-3">{{ data.product.description }}</div>

                                <div class="text-xs text-center">
                                    <div class="flex justify-center items-center gap-1">
                                        <div class="font-bold">{{ data.product.price }}DKK</div>
                                        <div class="font-bold">x</div>
                                        <div class="font-bold">{{ data.entities.length }}</div>
                                        <div class="font-bold">=</div>
                                        <div class="font-bold">{{ data.product.price * data.entities.length }}DKK</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button @click="setStep('person')" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                    Personal Information
                </button>
            </div>

            <div v-if="step === 'person'">
                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">Name</label>
                    <input type="text" v-model="name" class="w-full border border-gray-300" />
                </div>

                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">Email</label>
                    <input type="email" v-model="email" class="w-full border border-gray-300" />
                </div>

                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">Address</label>
                    <input type="text" v-model="address" class="w-full border border-gray-300" />
                </div>

                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">City</label>
                    <input type="text" v-model="city" class="w-full border border-gray-300" />
                </div>

                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">Country</label>
                    <input type="text" v-model="country" class="w-full border border-gray-300" />
                </div>

                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    <label class="block text-sm font-bold mb-1">Postal Code</label>
                    <input type="text" v-model="postalCode" class="w-full border border-gray-300" />
                </div>

                <div class="flex justify-between gap-3">
                    <button @click="setStep('overview')" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Back
                    </button>

                    <button @click="submitPersonalInformation()"
                        class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Delivery Option
                    </button>
                </div>
            </div>

            <div v-if="step === 'delivery'">
                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3" v-for="option in deliveryOptions"
                    :key="option.name">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <div class="font-bold">{{ option.name }}</div>
                            <div class="text-gray-500">Price: {{ option.price }}</div>
                        </div>
                        <div>
                            <input type="radio" v-model="deliveryOption" :value="option.name" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-between gap-3">
                    <button @click="setStep('person')" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Back
                    </button>

                    <button @click="submitDeliveryOption()" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Payment Method
                    </button>
                </div>
            </div>

            <div v-if="step === 'payment'">
                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3" v-for="method in paymentMethods"
                    :key="method.name">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <div class="font-bold">{{ method.name }}</div>
                            <div class="text-gray-500">Price: {{ method.price }}</div>
                        </div>
                        <div>
                            <input type="radio" v-model="paymentMethod" :value="method.name" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-between gap-3">
                    <button @click="setStep('delivery')" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Back
                    </button>

                    <button @click="submitPaymentMethod()" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                        Complete Purchase
                    </button>
                </div>
            </div>

            <div v-if="step === 'complete'">
                <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    Processing your purchase...
                </div>
            </div>

            <button @click="cancelPurchase()" class="bg-red-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Cancel Purchase
            </button>
        </div>
    </div>
</template>

<script setup>
import { useCheckout } from '../composables/useCheckout.js';
import { useShoppingCartSDK } from '../composables/useShoppingCartSDK';
import { useToast } from '../composables/useToast.js';
import { ref, computed, onBeforeMount } from 'vue'

const checkoutCtrl = useCheckout()
const shoppingCartCtrl = useShoppingCartSDK()
const toastCtrl = useToast()
const step = ref('overview')
const setStep = (newStep) => {
    step.value = newStep
}
const deliveryOptions = ref([
    { name: 'Standard Delivery', price: 5 },
    { name: 'Express Delivery', price: 10 },
    { name: 'Pickup', price: 0 }
])

const paymentMethods = ref([
    { name: 'Credit Card', price: 0 },
    { name: 'PayPal', price: 0 },
    { name: 'Bank Transfer', price: 0 }
])

const name = ref('')
const email = ref('')
const address = ref('')
const city = ref('')
const country = ref('')
const postalCode = ref('')

const deliveryOption = ref('')
const paymentMethod = ref('')

const submitPersonalInformation = () => {

    if (!name.value) {
        toastCtrl.add('Name is required', 5000, 'error')
        return
    }

    if (!email.value) {
        toastCtrl.add('Email is required', 5000, 'error')
        return
    }

    if (!address.value) {
        toastCtrl.add('Address is required', 5000, 'error')
        return
    }

    if (!city.value) {
        toastCtrl.add('City is required', 5000, 'error')
        return
    }

    if (!country.value) {
        toastCtrl.add('Country is required', 5000, 'error')
        return
    }

    if (!postalCode.value) {
        toastCtrl.add('Postal Code is required', 5000, 'error')
        return
    }

    setStep('delivery')
}

const submitDeliveryOption = () => {

    if (!deliveryOption.value) {
        toastCtrl.add('Delivery option is required', 5000, 'error')
        return
    }

    setStep('payment')
}

const submitPaymentMethod = async () => {

    if (!paymentMethod.value) {
        toastCtrl.add('Payment method is required', 5000, 'error')
        return
    }

    const params = {
        cart_uuid: shoppingCartCtrl.cart.value.uuid,
        name: name.value,
        email: email.value,
        address: address.value,
        city: city.value,
        country: country.value,
        postalCode: postalCode.value,
        deliveryOption: deliveryOption.value,
        paymentMethod: paymentMethod.value
    }

    const order = shoppingCartCtrl.sdk.api.ProductOrderController.create(params)

    setStep('complete')
}

const cancelPurchase = async () => {
    await shoppingCartCtrl.cancelCheckout()
    toastCtrl.add('Purchase cancelled', 5000, 'success')
}

onBeforeMount(async () => {
    await checkoutCtrl.reloadCheckout()
})
</script>