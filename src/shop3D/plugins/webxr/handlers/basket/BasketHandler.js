import WebXRHandler from '../../abstractions/WebXRHandler.js'
import Basket from './Basket.js';
import SelectPoint from './SelectPoint.js';
import * as THREE from 'three'

/**
 * @property {Basket} basket - The basket.
 */
const basket = new Basket()

/**
 * @property {Object} _view - The view.
 */
let _view = null;

/**
 * @property {SelectPoint} selectPoint - The select point.
 */
let selectPoint = null;

/**
 * @property {Checkout[]} checkouts - The checkouts.
 */
const checkouts = []

/**
 * @function initializeBasketSelectPoint
 * @description Initialize the basket select point.
 * @returns {void}
 */
function initializeBasketSelectPoint() {
    selectPoint = new SelectPoint(_view, new THREE.Vector3(-1, -.5, -.5))
    selectPoint.followVRPlayer()
}

/**
 * @function clearBasketSelectPoint
 * @description Clear the basket select point.
 * @returns {void}
 */
function clearBasketSelectPoint() {
    if (selectPoint) {
        selectPoint.dispose()
        selectPoint.stopFollowVRPlayer()
        selectPoint = null
    }
}

/**
 * @function grapBasket
 * @description Grap the basket.
 * @param {Object} event - The event.
 * @returns {void}
 */
function grapBasket(event) {
    if (basket.hasSelected()) {
        return
    }

    const target = event.target;
    const box = new THREE.Box3().setFromObject(target);
    if (selectPoint.intersectsBox(box)) {
        basket.grap(target, _view)
    }
}

/**
 * @function releaseBasket
 * @description Release the basket.
 * @returns {void}
 */
function releaseBasket(event) {
    if (event.target !== basket.getSelected()) {
        return
    }
    console.log('releaseBasket')
    // Check if the basket is selected
    if (basket.hasSelected()) {
        // Check if one of the checkouts collides with the basket
        const box = basket.getBox()
        for (let i = 0; i < checkouts.length; i++) {
            if (checkouts[i].intersectsBox(box)) {
                basket.addToCheckout(checkouts[i])
                return
            }
        }
    }

    basket.release(_view)
}

/**
 * @function clearBasket
 * @description Clear the basket.
 * @returns {void}
 */
function clearBasket() {
    basket.release()
    basket.removeSelectable()
}

/**
 * @function clearCheckouts
 * @description Clear the checkouts.
 * @returns {void}
 */
function clearCheckouts() {
    checkouts.length = 0
}

/**
 * @class BasketHandler
 * @classdesc The basket handler.
 */
class BasketHandler extends WebXRHandler {

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
        _view = view
        this.controllers = controllers

        // Note: If the xr session is ended, release the basket and clear the select point.
        view.renderer.xr.addEventListener('sessionstart', initializeBasketSelectPoint)
        view.renderer.xr.addEventListener('sessionend', clearBasketSelectPoint)
        view.renderer.xr.addEventListener('sessionend', releaseBasket)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('squeezestart', grapBasket)
            controller.addEventListener('squeezeend', releaseBasket)
        }

        this.initInvoker({ basket, checkouts })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        clearCheckouts()
        clearBasketSelectPoint()
        clearBasket()

        _view.renderer.xr.removeEventListener('sessionstart', initializeBasketSelectPoint)
        _view.renderer.xr.removeEventListener('sessionend', clearBasketSelectPoint)
        _view.renderer.xr.removeEventListener('sessionend', releaseBasket)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('squeezestart', grapBasket)
            controller.removeEventListener('squeezeend', releaseBasket)
        }
    }
}

export default BasketHandler
