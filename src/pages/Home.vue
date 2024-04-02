<template>
    <div>
        <div class="flex gap-3 fixed top-3 left-3 bottom-3 overflow-y-auto">
            <StartVROverlayVue />
            <CheckoutOverlay />
            
        </div>

        <canvas ref="canvasRef" v-show="shop.isRunning" />
        <div v-if="isInitializing">Initializing...</div>
        <div v-if="isStopped">Stopped...</div>
    </div>
</template>

<script setup>
import CheckoutOverlay from '../components/CheckoutOverlay.vue';
import StartVROverlayVue from '../components/StartVROverlay.vue';
import { useShop } from '../composables/useShop.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const shop = useShop()
const canvasRef = ref(null)
const isInitializing = computed(() => shop.isInitializing.value)
const isStopped = computed(() => shop.isStopped.value)

onMounted(async () => await shop.start(canvasRef.value))
onUnmounted(async () => await shop.stop())
</script>

<style scoped>
canvas {
    width: 100%;
    height: 100vh;
    display: block;
}
</style>
