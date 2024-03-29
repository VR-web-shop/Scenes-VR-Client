import WebXRHandler from '../../abstractions/WebXRHandler.js'
import * as THREE from 'three'

/**
 * @property {Checkout[]} checkouts - The checkouts.
 */
const checkouts = [];

/**
 * @property {CheckoutProduct[]} checkoutProducts - The checkout products.
 */
const checkoutProducts = [];
const checkoutProductsDispatcher = new THREE.EventDispatcher();

/**
 * @property {Object} checkoutUI - The checkout UI.
 */
let checkoutUI = null;

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
        this.initInvoker({ checkouts, checkoutProducts, checkoutProductsDispatcher, checkoutUI, quantityUI })
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
