<template>
    <div class="flex gap-3 fixed top-0 right-0 bottom-0 overflow-y-auto" style="z-index: 2;">
        <div v-if="show"
            class="h-full w-full bg-white shadow-md p-3 w-64 overflow-y-auto border border-gray-300">
            <h1 class="text-xl font-bold mb-1">
                Checkout
            </h1>

            <p class="text-gray-500 mb-3">
                Follow the instructions on the screen to complete your purchase.
            </p>

            <div v-if="step === STEPS.overview">
                <CheckoutProducts />

                <div v-if="checkoutCtrl.products.value.length === 0" class="bg-red-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                    <p class="font-bold">
                        Add products to your cart to continue.
                    </p>
                </div>

                <button v-else @click="setStep(STEPS.person)" class="bg-blue-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                    Personal Information
                </button>
            </div>

            <div v-else-if="step === STEPS.person">
                <ProductOrderPerson
                    :lastStep="() => setStep(STEPS.overview)"
                    :nextStep="submitPersonalInformation"
                />
            </div>

            <div v-else-if="step === STEPS.delivery">
                <ProductOrderDelivery
                    :lastStep="() => setStep(STEPS.person)"
                    :nextStep="submitDeliveryOption"
                />
            </div>

            <div v-else-if="step === STEPS.payment">
                <ProductOrderPayment
                    :lastStep="() => setStep(STEPS.delivery)"
                    :nextStep="submitPaymentMethod"
                />
            </div>

            <div v-else-if="step === STEPS.order_overview">
                <div v-if="productOrder">
                    <ProductOrderOverview />

                    <div class="flex justify-between gap-3">
                        <button @click="setStep(STEPS.person)" class="bg-gray-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                            Edit Order
                        </button>

                        <button @click="goToPayment()" class="bg-green-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                            Go to payment
                        </button>
                    </div>
                </div>
                <div v-else class="border border-gray-300 p-3 rounded-md shadow-md mt-3">
                    Creating your order...
                </div>
            </div>

            <div v-else-if="step === STEPS.card_information">
                <ProductOrderCredit 
                    :lastStep="() => setStep(STEPS.order_overview)"
                    :nextStep="showSuccess"
                />
            </div>

            <div v-else-if="step === STEPS.checkout_success">
                <ProductOrderComplete />
            </div>

            <button v-if="step !== STEPS.checkout_success" @click="cancelPurchase()" class="bg-red-500 text-white px-3 py-1 rounded-md mt-3 w-full">
                Cancel Purchase
            </button>
        </div>
    </div>
</template>

<script setup>
import CheckoutProducts from './checkout/CheckoutProducts.vue';
import ProductOrderCredit from './checkout/ProductOrderCredit.vue';
import ProductOrderOverview from './checkout/ProductOrderOverview.vue';
import ProductOrderPerson from './checkout/ProductOrderPerson.vue';
import ProductOrderPayment from './checkout/ProductOrderPayment.vue';
import ProductOrderDelivery from './checkout/ProductOrderDelivery.vue';
import ProductOrderComplete from './checkout/ProductOrderComplete.vue';
import { useCheckout } from '../composables/useCheckout.js';
import { useShoppingCartSDK } from '../composables/useShoppingCartSDK';
import { useToast } from '../composables/useToast.js';
import { ref, toRaw, computed, onBeforeMount } from 'vue'
import { v4 } from 'uuid';

const STEPS = {
    overview: 'overview',
    person: 'person',
    delivery: 'delivery',
    payment: 'payment',
    order_overview: 'order_overview',
    card_information: 'card_information',
    checkout_success: 'checkout_success'
}

const step = ref(STEPS.overview)
const setStep = (newStep) => {
    step.value = newStep
}

const checkoutCtrl = useCheckout()
const shoppingCartCtrl = useShoppingCartSDK()
const toastCtrl = useToast()
const productOrder = computed(() => checkoutCtrl.productOrder.value)
const show = computed(() => checkoutCtrl.show.value)

const params = ref({})

const submitPersonalInformation = (personalParams) => {
    params.value = {
        ...params.value,
        ...personalParams
    }

    setStep(STEPS.delivery)
}

const submitDeliveryOption = (deliverOptionParams) => {
    params.value = {
        ...params.value,
        ...deliverOptionParams
    }

    setStep(STEPS.payment)
}

const submitPaymentMethod = async (paymentOptionsParams) => {
    const cart = await shoppingCartCtrl.createOrFindCart();
    const req = {
        cart_client_side_uuid: cart.client_side_uuid,
        ...toRaw(params.value),
        ...toRaw(paymentOptionsParams),
    }

    let order;
    if (productOrder.value) {
        req.client_side_uuid = productOrder.value.client_side_uuid
        req.product_order_state_name = productOrder.value.product_order_state_name
        order = await shoppingCartCtrl.sdk.ProductOrder.update(req)
    } else {
        req.client_side_uuid = v4()
        req.product_order_state_name = 'WAITING_FOR_PAYMENT'
        order = await shoppingCartCtrl.sdk.ProductOrder.create(req)
    }
    
    checkoutCtrl.setProductOrder(order)
    setStep(STEPS.order_overview)
}

const cancelPurchase = async () => {
    await shoppingCartCtrl.cancelCheckout()
    await checkoutCtrl.reloadCheckout()
    toastCtrl.add('Purchase cancelled', 5000, 'success')
}

const goToPayment = () => {
    if (productOrder.value.payment_option_client_side_uuid === 'aaa-bbb-ccc') {
        setStep(STEPS.card_information)      
    } else {
        showSuccess()
    }
}

const showSuccess = async () => {
    setStep(STEPS.checkout_success)
    toastCtrl.add('Purchase completed', 5000, 'success')

    const cart = await shoppingCartCtrl.createOrFindCart()

    const r = await shoppingCartCtrl.sdk.ProductOrder.update({
        client_side_uuid: productOrder.value.client_side_uuid,
        name: productOrder.value.name,
        email: productOrder.value.email,
        address: productOrder.value.address,
        city: productOrder.value.city,
        postal_code: productOrder.value.postal_code,
        country: productOrder.value.country,
        payment_option_client_side_uuid: productOrder.value.payment_option_client_side_uuid,
        deliver_option_client_side_uuid: productOrder.value.deliver_option_client_side_uuid,
        product_order_state_name: 'WAITING_FOR_SHIPMENT',
        cart_client_side_uuid: cart.client_side_uuid
    })

    setTimeout(() => {
        location.reload()
    }, 15000)
}

onBeforeMount(async () => {
    await checkoutCtrl.reloadCheckout()

    if (productOrder.value) {
        setStep(STEPS.order_overview)
    }
})
</script>
