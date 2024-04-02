import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableBasket from "../../select/selectables/SelectableBasket.js";
import Checkout from "../Checkout.js";
import * as THREE from 'three'

/**
 * @class ShowCheckoutUICommand
 * @classdesc command for showing the basket's checkout UI.
 */
class ShowCheckoutUICommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {selectableBasket} selectableBasket - The selectable basket.
     * @param {Checkout} checkout - The checkout.
     */
    constructor(selectableBasket, checkout) {
        super()

        if (!(selectableBasket instanceof SelectableBasket)) {
            throw new Error('The selectableBasket is not an instance of SelectableBasket')
        }

        if (!(checkout instanceof Checkout)) {
            throw new Error('The checkout is not an instance of Checkout')
        }

        this.selectableBasket = selectableBasket
        this.checkout = checkout
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        this.selectableBasket.checkout = this.checkout
        this.selectableBasket.mesh.position.copy(this.checkout.getCenterSurface())
        this.selectableBasket.mesh.rotation.copy(new THREE.Euler(0, 0, 0))
        this.selectableBasket.mesh.visible = true

        options.checkoutUI.clearContentObjects()
        const checkoutProducts = options.checkoutProducts
        for (let i = 0; i < checkoutProducts.length; i++) {
            options.checkoutUI.addContentObject(checkoutProducts[i].toContentObject())
        }
        
        options.checkoutUI.setPosition(this.checkout.getUIPosition())
        options.checkoutUI.setRotation(this.checkout.getUIEulerRotation())
        options.checkoutUI.show()
    }
}

export default ShowCheckoutUICommand
