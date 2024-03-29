import SpatialUI from "../../../gui/spatialui/SpatialUI.js";
import BaseUIInterface from "../BaseUIInterface.js";
import { buildCheckoutPage } from "./CheckoutPage.js"
import { buildContentPage } from "./ContentPage.js"
import * as THREE from 'three'

/**
 * General UI options
 */
const width = 2
const height = 1
const bggColor = 0x000000

/**
 * @constant checkoutDispatcher
 */
const checkoutDispatcher = new THREE.EventDispatcher()
const EVENTS = { START_CHECKOUT: 'startCheckout', CANCEL_CHECKOUT: 'cancelCheckout' }

/**
 * @function addEventListener
 * @description Add an event listener.
 * @param {string} type - The event type. Possible values: 'startCheckout', 'cancelCheckout'.
 * @param {Function} listener - The event listener.
 * @returns {void}
 */
function addEventListener(type, listener) {
    checkoutDispatcher.addEventListener(type, listener)
}

/**
 * @function removeEventListener
 * @description Remove an event listener.
 * @param {string} type - The event type. Possible values: 'startCheckout', 'cancelCheckout'.
 * @param {Function} listener - The event listener.
 * @returns {void}
 */
function removeEventListener(type, listener) {
    checkoutDispatcher.removeEventListener(type, listener)
}

/**
 * @function buildBasketUI
 * @description Build the basket UI.
 * @returns {void}
 */
export async function buildBasketUI() {
    const checkout = buildCheckoutPage()
    const content = buildContentPage()
    const parent = new SpatialUI.SpatialUIBuilder()
        /**
         * Create the UI's background panel.
         */
        .addPanel(width, height, bggColor)
        /**
         * Add the checkout page to the parent.
         */
        .addChildContainerElement(checkout.container, 'checkout')
        /**
         * Add the content page to the parent.
         */
        .addChildContainerElement(content.container, 'content')
        .build()

    /**
     * Add the button listeners.
     */
    checkout.cancelButton.addClickListener(() => {
        const contentObjects = content.contentObjects()
        checkoutDispatcher.dispatchEvent({ type: EVENTS.CANCEL_CHECKOUT, contentObjects })
        checkout.hide()
        content.show()
    })
    content.checkoutButton.addClickListener(() => {
        const contentObjects = content.contentObjects()
        const totalPrice = contentObjects.reduce((acc, obj) => acc + obj.getPrice(), 0)
        checkout.setTotal(totalPrice)
        checkoutDispatcher.dispatchEvent({ type: EVENTS.START_CHECKOUT, contentObjects })
        content.hide()
        checkout.show()
    })
    content.cancelButton.addClickListener(() => {
        parent.container.setVisbility(false)
    })

    function addContentObject(contentObject) {
        content.addContentObject(contentObject)
    }

    /**
     * The exposed functions.
     */
    const uiInterface = { 
        ...BaseUIInterface(parent),
        addEventListener,
        removeEventListener,
        addContentObject
    }

    /**
     * Hide the UI as default.
     */
    uiInterface.hide()

    return { parent, uiInterface }
}
