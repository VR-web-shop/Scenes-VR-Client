import WebXRHandler from '../../abstractions/WebXRHandler.js'
import * as THREE from 'three'

/**
 * @property {Checkout[]} checkouts - The checkouts.
 */
const checkouts = [];

/**
 * @property {CheckoutProduct[]} checkoutProducts - The checkout products.
 */
export const checkoutProducts = [];
const checkoutProductsDispatcher = new THREE.EventDispatcher();
function addEventListener(event, callback) {
    checkoutProductsDispatcher.addEventListener(event, callback)
}
function removeEventListener(event, callback) {
    checkoutProductsDispatcher.removeEventListener(event, callback)
}
function dispatchEvent(event, data) {
    checkoutProductsDispatcher.dispatchEvent({ type: event, data })
}

/**
 * @property {Object} checkoutUI - The checkout UI.
 */
export let checkoutUI = null;

/**
 * @property {Object} quantityUI - The quantity UI.
 */
let quantityUI = null;

/**
 * @class CheckoutHandler
 * @classdesc The checkout handler.
 */
class CheckoutHandler extends WebXRHandler {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function init
     * @description Initialize the handler.
     * @param {Object} view - The view.
     * @param {Object[]} controllers - The controllers.
     * @returns {void}
     */
    init(view, controllers) {
        this.view = view
        this.controllers = controllers
        this.initInvoker({ 
            checkouts, 
            checkoutProducts, 
            addEventListener, 
            removeEventListener,
            dispatchEvent,
            checkoutUI, 
            quantityUI
        })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        checkoutUI = null
        quantityUI = null
        checkoutProducts.length = 0
        checkouts.length = 0
    }

    getCheckouts() {
        return checkouts
    }

    getBasket() {
        return basket
    }
}

export default CheckoutHandler
