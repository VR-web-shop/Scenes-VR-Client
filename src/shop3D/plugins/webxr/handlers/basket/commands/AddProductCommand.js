import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../../select/selectables/SelectableProduct.js";
import CheckoutProduct from "../CheckoutProduct.js";

/**
 * @class AddProductCommand
 * @classdesc command for adding a product to the basket.
 */
class AddProductCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {SelectableProduct} selectableProduct - The selectable product.
     * @param {boolean} castEvent - The cast event.
     */
    constructor(selectableProduct, castEvent = true) {
        super()

        if (!(selectableProduct instanceof SelectableProduct)) {
            throw new Error('The selectableProduct is not an instance of SelectableProduct')
        }

        this.selectableProduct = selectableProduct
        this.castEvent = castEvent
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        for (const checkoutProduct of options.checkoutProducts) {
            if (checkoutProduct.selectableProduct.product.uuid === this.selectableProduct.product.uuid) {
                return;
            }
        }
        
        const checkoutProduct = new CheckoutProduct(this.selectableProduct)
        options.checkoutProducts.push(checkoutProduct)
        console.log('checkoutProduct:', this.castEvent)
        if (this.castEvent) options.dispatchEvent('addProduct', checkoutProduct)
    }
}

export default AddProductCommand
