import WebXRHandler from '../../WebXRHandler.js'
import Basket from './Basket.js';
import Checkout from './Checkout.js';
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
        basket.grap(target)
    }
}

/**
 * @function releaseBasket
 * @description Release the basket.
 * @returns {void}
 */
function releaseBasket() {
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

    basket.release()
}

/**
 * @function clearBasket
 * @description Clear the basket.
 * @returns {void}
 */
function clearBasket() {
    basket.release()
    basket.removeMesh()
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
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        checkouts.length = 0
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

    /**
     * @function addCheckout
     * @description Add a checkout.
     * @param {Object} object3D - The object.
     * @param {THREE.Vector3} surfaceOffset - The surface offset.
     * @param {THREE.Vector3} surfaceSize - The surface size.
     * @returns {void}
     */
    addCheckout (object3D, surfaceOffset, surfaceSize) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        checkouts.push(new Checkout(object3D, surfaceOffset, surfaceSize));
    }

    /**
     * @function removeCheckout
     * @description Remove a checkout.
     * @param {Object} object3D - The object.
     * @returns {void}
     * @throws {Error} The object must be an instance of THREE.Object3D.
     */
    removeCheckout (object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        const index = checkouts.findIndex(checkout => checkout.mesh === object3D);
        if (index !== -1) {
            checkouts.splice(index, 1);
        }
    }

    /**
     * @function addBasket
     * @description Add a basket.
     * @param {Object} object3D - The object.
     * @param {THREE.Vector3} selectOffset - The select offset.
     * @returns {void}
     * @throws {Error} The object must be an instance of THREE.Object3D.
     * @throws {Error} The select offset must be an instance of THREE.Vector3.
     */
    addBasket (object3D, selectOffset = new THREE.Vector3(0, 0, 0)) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        if (!selectOffset instanceof THREE.Vector3) {
            throw new Error('The select offset must be an instance of THREE.Vector3')
        }

        basket.addMesh(object3D);
        basket.setOffset(selectOffset);
    }

    /**
     * @function getBasket
     * @description Get the basket.
     * @returns {Object} The basket.
     */
    getBasket () {
        return basket.getMesh();
    }

    /**
     * @function removeBasket
     * @description Remove the basket.
     * @returns {void}
     */
    removeBasket () {
        basket.removeMesh();
    }

    addBasketUI (ui) {
        basket.addUI(ui);
    }
}

export default BasketHandler
