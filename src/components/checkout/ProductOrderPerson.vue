<template>
    <div>
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
            <button @click="lastStep()" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Back
            </button>

            <button @click="submit()" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Delivery Option
            </button>
        </div>
    </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js';
import { useCheckout } from '../../composables/useCheckout.js';
import { ref, computed, onBeforeMount } from 'vue'

const toastCtrl = useToast()
const checkoutCtrl = useCheckout()

const props = defineProps({
    lastStep: {
        type: Function,
        required: true
    },
    nextStep: {
        type: Function,
        required: true
    },
})

const productOrder = computed(() => checkoutCtrl.productOrder.value)

const name = ref('')
const email = ref('')
const address = ref('')
const city = ref('')
const country = ref('')
const postalCode = ref('')

const submit = () => {
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

    props.nextStep({
        name: name.value,
        email: email.value,
        address: address.value,
        city: city.value,
        country: country.value,
        postal_code: postalCode.value
    })
}

onBeforeMount(async () => {
    if (productOrder.value) {
        name.value = productOrder.value.name
        email.value = productOrder.value.email
        address.value = productOrder.value.address
        city.value = productOrder.value.city
        country.value = productOrder.value.country
        postalCode.value = productOrder.value.postal_code
    }
})
</script>