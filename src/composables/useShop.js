import { ref, computed } from 'vue';
import { useSceneSDK } from './useScenesSDK.js';
import { useShoppingCartSDK } from './useShoppingCartSDK.js';

import AddOnStateChangeListener from '../shop3D/commands/events/AddOnStateChangeListener.js';
import RemoveOnStateChangeListener from '../shop3D/commands/events/RemoveOnStateChangeListener.js';

import Shop from '../shop3D/Shop.js'

const shop = new Shop()
const state = ref(null)
const isInitializing = computed(() => state.value === 'InitializeState')
const isRunning = computed(() => state.value === 'ExecuteState')
const isStopped = computed(() => state.value === 'ExitState')

const scenesCtrl = useSceneSDK()
const shoppingCartCtrl = useShoppingCartSDK()

export function useShop() {

    function onStateChanged(event) {
        state.value = event.newState.constructor.name
    }

    async function start(canvas) {
        // The listener below must be added before the shop starts.
        // Otherwise, the listener will lose the first state change.
        await shop.invoke(new AddOnStateChangeListener(onStateChanged))

        shop.start(canvas)
        await scenesCtrl.start(shop);
        await shoppingCartCtrl.start(shop);
    }

    async function stop() {
        await shop.invoke(new RemoveOnStateChangeListener(onStateChanged))
        await shoppingCartCtrl.exit(shop);
        shop.stop()
    }

    return {
        shop,
        isInitializing,
        isRunning,
        isStopped,
        start,
        stop
    }
}
