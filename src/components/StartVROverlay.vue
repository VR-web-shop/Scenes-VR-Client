<template>
    <div>
        <div class="flex gap-3 absolute top-0 left-0 right-0 overflow-y-auto">
            <div class="bg-black/60 shadow-md p-3 text-white w-full text-center">
                <small class="text-orange-500 font-bold text-xs uppercase w-full">
                    Over {{ noOfProducts }} unique products available!
                </small>
            </div>
        </div>


        <div class="flex gap-3 absolute bottom-3 left-0 right-0 overflow-y-auto">
            <div class="rounded-lg sm:p-6 md:p-12 max-w-3xl mx-auto bg-black/60 shadow-lg overflow-y-auto text-white flex justify-between gap-3">
                <div>
                    <h1 class="text-2xl text-left font-bold mb-1 tracking-wider">
                        Electronics Hub VR
                    </h1>

                    <small class="text-orange-500 font-bold text-xs uppercase mb-1">
                        Unlock the Gateway to Your Virtual Realm.
                    </small>

                    <p class="text-gray-300 text-sm mb-3">
                        Dive into a world of immersive experiences with our cutting-edge virtual reality electronics.
                        <br />Log in to explore, create, and connect in the digital dimension.
                    </p>
                </div>

                <button @click="toggle" class="text-white px-5 py-1 rounded-md"
                    :class="webXR ? 'bg-red-500' : 'bg-blue-500'">
                    {{ webXR ? 'Exit VR' : 'Enter VR' }}
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { useShop } from '../composables/useShop.js';
import { useSceneSDK } from '../composables/useScenesSDK.js';
import { ref, computed } from 'vue';

const shop = useShop()
const scene = useSceneSDK()
const webXR = ref(false)
const noOfProducts = computed(() => scene.noOfProducts)

const toggle = () => {
    webXR.value = !webXR.value
    shop.toggleWebXR()
}
</script>
