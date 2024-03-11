import SpatialUI from "../../gui/SpatialUI.js";
import ContentPage from "./gui/ContentPage.js";
import CheckoutPage from "./gui/CheckoutPage.js";
import Utils from "./gui/Utils.js";
import * as THREE from "three";

class BasketUI {
    constructor() {
        
    }

    async init(scene) {
        await Utils.asyncInitFont()

        const eventDispatcher = new THREE.EventDispatcher()
        const parent = new SpatialUI.SpatialUIBuilder()
            .addPanel(5.5, 4, 0x000000)
            .build().container

        parent.addToScene(scene)
        parent.setPosition(new THREE.Vector3(0, 3, 0))
        parent.setVisbility(false)

        const checkoutPage = new CheckoutPage(parent)
        const showCheckoutPage = () => {
            checkoutPage.show.bind(checkoutPage)
            eventDispatcher.dispatchEvent({ type: 'checkout' })
        }

        const contentPage = new ContentPage(parent, showCheckoutPage)
        const showContentPage = contentPage.show.bind(contentPage)

        checkoutPage.addEventListener('hide', showContentPage)
        checkoutPage.hide()

        this.show = (position) => {
            parent.setPosition(position.clone().add(new THREE.Vector3(0, 3, 0)))
            parent.setVisbility(true)
        }

        this.hide = () => {
            parent.setVisbility(false)
        }

        this.addCheckoutListener = (listener) => {
            eventDispatcher.addEventListener('checkout', listener)
        }

        this.removeCheckoutListener = (listener) => {
            eventDispatcher.removeEventListener('checkout', listener)
        }
    }
}

export default BasketUI
