<template>
    <div>
        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3" v-for="option in deliveryOptions"
            :key="option.name">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <div class="font-bold">{{ option.name }}</div>
                    <div class="text-gray-500">Price: {{ option.price }} {{ valuta }}</div>
                </div>
                <div>
                    <input type="radio" v-model="deliveryOption" :value="option.client_side_uuid" />
                </div>
            </div>
        </div>

        <div class="flex justify-between gap-3">
            <button @click="lastStep()" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Back
            </button>

            <button @click="submit()" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Payment Method
            </button>
        </div>
    </div>
</template>

<script setup>
import { useProductsSDK } from '../../composables/useProductsSDK.js';
import { useToast } from '../../composables/useToast.js';
import { useCheckout } from '../../composables/useCheckout.js';
import { ref, computed, onBeforeMount } from 'vue'

const toastCtrl = useToast()
const checkoutCtrl = useCheckout()
const productsSDK = useProductsSDK()

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

const valuta = computed(() => productsSDK.valuta.value?.short)

const deliveryOptions = computed(() => checkoutCtrl.deliveryOptions.value)
const productOrder = computed(() => checkoutCtrl.productOrder.value)
const deliveryOption = ref('')

const submit = () => {
    if (!deliveryOption.value) {
        toastCtrl.add('Delivery option is required', 5000, 'error')
        return
    }

    props.nextStep({
        deliver_option_client_side_uuid: deliveryOption.value
    })
}

onBeforeMount(async () => {
    if (productOrder.value) {
        deliveryOption.value = productOrder.value.deliver_option_client_side_uuid
    }
})
</script>