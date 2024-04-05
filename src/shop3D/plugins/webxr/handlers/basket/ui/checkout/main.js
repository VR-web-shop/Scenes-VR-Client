import SpatialUI from "../../../gui/spatialui/SpatialUI.js";
import BaseUIInterface from "../BaseUIInterface.js";
import { buildCheckoutPage } from "./CheckoutPage.js"
import { buildContentPage } from "./ContentPage.js"
import * as THREE from 'three'
import ContentObject from "./ContentObject.js"
import SelectableProduct from "../../../select/selectables/SelectableProduct.js";

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
export async function buildBasketUI(guiHandler) {
    if (!guiHandler) {
        throw new Error('The guiHandler must be defined')
    }

    const checkout = buildCheckoutPage()
    const content = buildContentPage(guiHandler)
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
        const valuta = SelectableProduct.getValuta()
        const contentObjects = content.contentObjects()
        const totalPrice = contentObjects.reduce((acc, obj) => acc + obj.getPrice(), 0)
        checkout.setTotal(totalPrice, valuta.symbol)
        checkoutDispatcher.dispatchEvent({ type: EVENTS.START_CHECKOUT, contentObjects })
        content.hide()
        checkout.show()
    })
    content.cancelButton.addClickListener(() => {
        parent.container.setVisibility(false)
    })

    async function addContentObject(contentObject) {
        await content.addContentObject(contentObject)
    }

    function clearContentObjects() {
        content.clearContentObjects()
    }

    /**
     * The exposed functions.
     */
    const uiInterface = { 
        ...BaseUIInterface(parent),
        addEventListener,
        removeEventListener,
        addContentObject,
        clearContentObjects
    }

    /**
     * Hide the UI as default.
     */
    uiInterface.hide()

    return { parent, uiInterface }
}
