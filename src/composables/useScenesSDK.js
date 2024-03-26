import SceneSDK from '@vr-web-shop/scenes'

const SERVER_URL = 'http://localhost:3003'
const sdk = new SceneSDK(SERVER_URL)

export function useSceneSDK() {
    return {
        sdk
    }
}
