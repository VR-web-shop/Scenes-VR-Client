<template>
    <canvas ref="canvasRef" v-show="isRunning" />
    <div v-if="isInitializing">Initializing...</div>
    <div v-if="isStopped">Stopped...</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// State Commands
import AddOnStateChangeListener from '../shop3D/commands/events/AddOnStateChangeListener.js';
import RemoveOnStateChangeListener from '../shop3D/commands/events/RemoveOnStateChangeListener.js';

// WebXR Commands
import AddWebXRFloorCommand from '../shop3D/commands/webxr/AddWebXRFloorCommand.js';
import AddWebXRSelectableCommand from '../shop3D/commands/webxr/AddWebXRSelectableCommand.js';
import AddWebXRBasketCommand from '../shop3D/commands/webxr/AddWebXRBasketCommand.js';
import AddWebXRCheckoutCommand from '../shop3D/commands/webxr/AddWebXRCheckoutCommand.js';
import RemoveWebXRFloorCommand from '../shop3D/commands/webxr/RemoveWebXRFloorCommand.js';
import RemoveWebXRSelectableCommand from '../shop3D/commands/webxr/RemoveWebXRSelectableCommand.js';
import RemoveWebXRBasketCommand from '../shop3D/commands/webxr/RemoveWebXRBasketCommand.js';
import RemoveWebXRCheckoutCommand from '../shop3D/commands/webxr/RemoveWebXRCheckoutCommand.js';

// View Commands
import SetCameraCommand from '../shop3D/commands/view/SetCameraCommand.js';
import SetSceneBggCommand from '../shop3D/commands/view/SetSceneBggCommand.js';

// Primitive Commands
import LoadPrimitiveCommand from '../shop3D/commands/primitives/LoadPrimitiveCommand.js';
import RemovePrimitiveCommand from '../shop3D/commands/primitives/RemovePrimitiveCommand.js';

// Light Commands
import LoadLightCommand from '../shop3D/commands/lights/LoadLightCommand.js';
import RemoveLightCommand from '../shop3D/commands/lights/RemoveLightCommand.js';

// Mesh Commands
import LoadMeshCommand from '../shop3D/commands/caches/LoadMeshCommand.js';
import RemoveMeshCommand from '../shop3D/commands/caches/RemoveMeshCommand.js';

import Shop from '../shop3D/Shop.js'

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

    const material = { type: 'MeshStandardMaterial', textures: [{ type: 'map', src: 'textures/black_fabric_basecolor.png' }] }

    await shop.invoke(new LoadPrimitiveCommand('PlaneGeometry', { width: 100, height: 100 }, material, { x: 0, y: 0, z: 0 }, { x: -Math.PI / 2, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'Plane'))
    await shop.invoke(new SetSceneBggCommand({ color: 0xCCCDDD }))
    await shop.invoke(new SetCameraCommand({ x: 0, y: 3, z: 8 }, { x: 0, y: 0, z: -10 }))
    await shop.invoke(new LoadLightCommand('DirectionalLight', 0xffffff, 3, { x: 0, y: 1, z: 0 }, 'Light'))
    await shop.invoke(new LoadMeshCommand('meshes/chair.glb', [
        { name: 'Chair_Pillow', material },
    ], { x: 7, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'Chair'))
    await shop.invoke(new LoadMeshCommand('meshes/chair.glb', [
        { name: 'Chair_Pillow', material },
    ], { x: 6, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'Chair2'))
    await shop.invoke(new LoadMeshCommand('meshes/basket.glb', [
        { name: 'Basket', material },
    ], { x: -1.4, y: 1.8, z: -4 }, { x: 0, y: Math.PI / 2, z: 0 }, { x: 1, y: 1, z: 1 }, 'Basket'))
    await shop.invoke(new LoadMeshCommand('meshes/checkout.glb', [
        { name: 'Checkout', material },
    ], { x: 3, y: 1, z: -5 }, { x: 0, y: -Math.PI / 2, z: 0 }, { x: 1, y: 1, z: 1 }, 'Checkout'))
    await shop.invoke(new LoadMeshCommand('meshes/basket_placeholder.glb', [
        { name: 'Basket_Placeholder', material },
    ], { x: 0, y: 0, z: 0 }, { x: 0, y: -Math.PI / 2, z: 0 }, { x: 1, y: 1, z: 1 }, 'Basket_Placeholder'))
    await shop.invoke(new AddWebXRFloorCommand({ name: 'Plane' }))
    await shop.invoke(new AddWebXRFloorCommand({ name: 'Chair' }))
    await shop.invoke(new AddWebXRSelectableCommand({ name: 'Chair2' }))
    await shop.invoke(new AddWebXRBasketCommand({ name: 'Basket' }, { name: 'Basket_Placeholder' }, { x: 0, y: -0.6, z: 0 }, { x: 0, y: 0, z: 0 }))
    await shop.invoke(new AddWebXRCheckoutCommand({ name: 'Checkout' }, { x: 0, y: 1.3, z: 0 }, { x: 0.8, y: 0.5, z: 1.7 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }))
    //await shop.invoke(new RemoveMeshCommand({ name: 'Chair' }))
    //await shop.invoke(new RemoveLightCommand({ name: 'Light' }))
    //await shop.invoke(new RemovePrimitiveCommand({ name: 'Plane' }))
    
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
