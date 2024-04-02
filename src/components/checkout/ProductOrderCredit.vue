<template>
    <div>
        <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
            <label class="block text-sm font-bold mb-1">Card Number</label>
            <input type="text" v-model="cardNumber" class="w-full border border-gray-300" placeholder="1234 5678 9012 3456" />
        </div>

        <div class="flex items-center justify-center gap-3">
            <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                <label class="block text-sm font-bold mb-1">Expiration Date (MM/YY)</label>
                <input type="text" v-model="expirationDate" class="w-full border border-gray-300" placeholder="12/23" />
            </div>

            <div class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                <label class="block text-sm font-bold mb-1">CVV</label>
                <input type="text" v-model="cvv" class="w-full border border-gray-300" placeholder="123" />
            </div>
        </div>

        <div class="flex justify-between gap-3">
            <button @click="lastStep()" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Back
            </button>

            <button @click="submit()"
                class="bg-green-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Complete
            </button>
        </div>
    </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js';
import { ref } from 'vue'

const toastCtrl = useToast()
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

const cardNumber = ref('')
const expirationDate = ref('')
const cvv = ref('')

const submit = () => {

    if (!cardNumber.value) {
        toastCtrl.add('Card number is required', 5000, 'error')
        return
    }

    if (!expirationDate.value) {
        toastCtrl.add('Expiration date is required', 5000, 'error')
        return
    }

    if (!cvv.value) {
        toastCtrl.add('CVV is required', 5000, 'error')
        return
    }
    
    props.nextStep({
        card_number: cardNumber.value,
        expiration_date: expirationDate.value,
        cvv: cvv.value
    })
}
</script>