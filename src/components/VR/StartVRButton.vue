<template>
    <button @click="toggle" class="text-white px-5 py-1 rounded-md block"
        :class="webXR ? 'bg-red-500' : 'bg-orange-500'">
        {{ webXR ? 'Exit VR' : 'Enter VR' }}
    </button>
</template>

<script setup>
import { useShop } from '../../composables/useShop.js';
import { ref } from 'vue';

const shop = useShop()
const webXR = ref(false)

const toggle = () => {
    webXR.value = !webXR.value
    shop.toggleWebXR()
}
</script>
