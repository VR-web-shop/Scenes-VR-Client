<template>
    <div class="px-10 py-24 text-gray-800 max-w-3xl mx-auto">
        <h2 class="font-bold text-center text-5xl mb-6">
            Ready to start shopping?
        </h2>

        <p class="font-bold text-center text-md mb-16">
            We are excited to welcome you to our virtual reality shopping experience! Get comfortable, put on your VR headset and follow the steps below to start shopping.
        </p>

        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-16 px-10">

            <div class="flex justify-center gap-3">
                <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                    <div>
                        <div class="text-2xl text-center font-bold">
                            1.
                        </div>
                        <VRIcon fill="white" width="2em" height="2em" />
                    </div>
                </div>
                <div class="text-sm text-center font-bold">
                    Find your favorite VR headset with a
                    built-in browser or connect your VR
                    headset to your computer.
                </div>
            </div>

            <div class="flex justify-center gap-3">
                <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                    <div>
                        <div class="text-2xl text-center font-bold">
                            2.
                        </div>
                        <PointIcon fill="white" width="2em" height="2em" />
                    </div>
                </div>
                <div class="text-sm text-center font-bold">
                    Put on your VR headset and press the 
                    'Enter VR'-button below to start the 
                    virtual reality experience.
                </div>
            </div>

            <div class="flex justify-center gap-3">
                <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                    <div>
                        <div class="text-2xl text-center font-bold">
                            3.
                        </div>
                        <BasketIcon fill="white" width="2em" height="2em" />
                    </div>
                </div>
                <div class="text-sm text-center font-bold">
                    Navigate through the scene using teleportation and use
                    the pocket near your body to pull out a basket to add
                    products to your cart.
                </div>
            </div>

            <div class="flex justify-center gap-3">
                <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                    <div>
                        <div class="text-2xl text-center font-bold">
                            4.
                        </div>
                        <TruckIcon fill="white" width="2em" height="2em" />
                    </div>
                </div>
                <div class="text-sm text-center font-bold">
                    Place the basket on a checkout area to initiate a new
                    checkout. As soon as you have completed the checkout,
                    we will deliver your products to your doorstep!
                </div>
            </div>

        </div>
    </div>

    <div class="px-10 py-24 bg-black text-white">
        <div class="max-w-3xl mx-auto">
            <h2 class="font-bold text-center text-5xl mb-6">
                We have selected a few products for you!
            </h2>

            <p class="font-bold text-center text-md mb-16">
                Every product below can be found in our virtual reality store. We have selected a few products for you to get started with. If you are ready to start shopping, put on your VR headset and follow the steps below.
            </p>

            <div class="grid grid-cols-3 gap-6 px-10">

                <div v-for="product in products" :key="product.uuid" class="">
                    <div class="mb-10 border border-gray-300 rounded-md p-8 bg-gray-300 flex items-center justify-center">
                        <div>
                            <img :src="product.Product.thumbnail_source" class="w-24 h-24" />
                        </div>
                    </div>
                    <div class="text-xl text-center font-bold mb-1">
                        {{ product.Product.name }}
                    </div>

                    <div class="text-md text-center font-bold">
                        {{ product.Product.description }}
                    </div>

                    <div class="text-center mt-3">
                        <div class="font-bold">{{ product.Product.price }} {{ valuta }}</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import PointIcon from './icons/PointIcon.vue';
import VRIcon from '../components/icons/VRIcon.vue';
import BasketIcon from '../components/icons/BasketIcon.vue';
import TruckIcon from '../components/icons/TruckIcon.vue';
import { useSceneSDK } from '../composables/useScenesSDK.js';
import { useProductsSDK } from '../composables/useProductsSDK.js';
import { computed } from 'vue';

const productsSDK = useProductsSDK()
const valuta = computed(() => productsSDK.valuta.value?.short)

const scene = useSceneSDK()
const products = computed(() => {
    const p = scene.products.value
    const l = p.length
    if (l === 0) return []

    const n = l > 4 ? 4 : p.length
    const randomStartPoint = Math.floor(Math.random() * (l - n))
    for (let i = 0; i < n; i++) {
        p[i] = p[randomStartPoint + i]
    }
    return p
})
</script>