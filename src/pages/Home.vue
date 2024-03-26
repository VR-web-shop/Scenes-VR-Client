<template>
    <canvas ref="canvasRef" v-show="isRunning" />
    <div v-if="isInitializing">Initializing...</div>
    <div v-if="isStopped">Stopped...</div>
</template>

<script setup>
import { useScene } from '../composables/useScene.js';
import { ref, onMounted, onUnmounted, computed } from 'vue';

import AddOnStateChangeListener from '../shop3D/commands/events/AddOnStateChangeListener.js';
import RemoveOnStateChangeListener from '../shop3D/commands/events/RemoveOnStateChangeListener.js';

import Shop from '../shop3D/Shop.js'

const sceneCtrl = useScene()
const canvasRef = ref(null)
const shop = new Shop()
const state = ref(null)
const isInitializing = computed(() => state.value === 'InitializeState')
const isRunning = computed(() => state.value === 'ExecuteState')
const isStopped = computed(() => state.value === 'ExitState')

function onStateChanged(event) {
    state.value = event.newState.constructor.name
}

onMounted(async () => {
    await shop.invoke(new AddOnStateChangeListener(onStateChanged))
    shop.start(canvasRef.value)
    await sceneCtrl.loadScene(shop);
})
onUnmounted(async () => {
    await shop.invoke(new RemoveOnStateChangeListener(onStateChanged))
    shop.stop()
})
</script>

<style scoped>
canvas {
    width: 100%;
    height: 100vh;
    display: block;
}
</style>
