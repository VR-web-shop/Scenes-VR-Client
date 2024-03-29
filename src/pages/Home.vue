<template>
    <div>
        <canvas ref="canvasRef" v-show="shop.isRunning" />
        <div v-if="shop.isInitializing">Initializing...</div>
        <div v-if="shop.isStopped">Stopped...</div>
    </div>
</template>

<script setup>
import { useShop } from '../composables/useShop.js';
import { ref, onMounted, onUnmounted } from 'vue';

const shop = useShop()
const canvasRef = ref(null)

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
