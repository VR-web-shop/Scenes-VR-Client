import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../../select/selectables/SelectableProduct.js";
import QuantityObject from "../ui/quantity/QuantityObject.js";
import { getXRPosition } from "../../teleport/TeleportHandler.js";

/**
 * @class ShowQuantityUICommand
 * @classdesc command for showing the basket's quantity UI.
 */
class ShowQuantityUICommand extends WebXRHandlerCommand {

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
        const selectableProductPosition = this.selectableProduct.lastPosition
        const xrPosition = getXRPosition();
        xrPosition.y = selectableProductPosition.y

        const quantityObject = new QuantityObject(1,
            this.selectableProduct.getAvailableProductEntitiesTotal.bind(this.selectableProduct),
            this.selectableProduct.onConfirmAddToBasket.bind(this.selectableProduct),
            this.selectableProduct.onCancelAddToBasket.bind(this.selectableProduct)
        )
        
        options.quantityUI.setQuantityObject(quantityObject)
        options.quantityUI.setPosition(selectableProductPosition)
        options.quantityUI.lookAt(xrPosition)
        options.quantityUI.show()
    }
}

export default ShowQuantityUICommand
