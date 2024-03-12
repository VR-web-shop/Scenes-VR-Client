import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class RemoveBasketSelectableCommand
 * @classdesc command for removing a basket's selectable.
 */
class RemoveBasketSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        options.basket.removeSelectable();
    }
}

export default RemoveBasketSelectableCommand
