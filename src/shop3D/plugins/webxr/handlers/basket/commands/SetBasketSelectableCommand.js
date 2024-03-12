import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableBasket from "../../select/selectables/SelectableBasket.js";

/**
 * @class SetBasketSelectableCommand
 * @classdesc command for setting the basket's selectable.
 */
class SetBasketSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {SelectableBasket} selectableBasket - The checkout's selectableBasket
     */
    constructor(selectableBasket) {
        super()

        if (!(selectableBasket instanceof SelectableBasket)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        this.selectableBasket = selectableBasket
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        options.basket.setSelectable(this.selectableBasket);
    }
}

export default SetBasketSelectableCommand
