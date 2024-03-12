import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../../select/selectables/SelectableProduct.js";

/**
 * @class RemoveBasketProductCommand
 * @classdesc command for removing a selectable product from the basket.
 */
class RemoveBasketProductCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {SelectableProduct} selectableProduct - The selectableProduct.
     */
    constructor(selectableProduct) {
        super()

        if (!(selectableProduct instanceof SelectableProduct)) {
            throw new Error('The selectableProduct must be an instance of SelectableProduct')
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
        options.basket.removeSelectableProduct(this.selectableProduct)
    }
}

export default RemoveBasketProductCommand
