import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../../select/selectables/SelectableProduct.js";

/**
 * @class AddBasketProductCommand
 * @classdesc command for adding a selectable product to the basket.
 */
class AddBasketProductCommand extends WebXRHandlerCommand {

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
        options.basket.addSelectableProduct(this.selectableProduct)
    }
}

export default AddBasketProductCommand
