import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../../select/selectables/SelectableProduct.js";
import CheckoutProduct from "../CheckoutProduct.js";

/**
 * @class RemoveProductCommand
 * @classdesc command for removing a product from the basket.
 */
class RemoveProductCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {SelectableProduct} selectableProduct - The selectable product.
     */
    constructor(selectableProduct) {
        super()

        if (!(selectableProduct instanceof SelectableProduct)) {
            throw new Error('The selectableProduct is not an instance of SelectableProduct')
        }

        this.selectableProduct = selectableProduct
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
                const productEntitiesInUse = [...this.selectableProduct.productEntitiesInUse]
                options.dispatchEvent('removeProduct', {checkoutProduct, productEntitiesInUse})
                const index = options.checkoutProducts.indexOf(checkoutProduct)
                options.checkoutProducts.splice(index, 1)
                break;
            }
        }
    }
}

export default RemoveProductCommand
