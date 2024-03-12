import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class GetBasketSelectableCommand
 * @classdesc command for getting the basket's selectable.
 */
class GetBasketSelectableCommand extends WebXRHandlerCommand {

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
        return options.basket.getSelectable();
    }
}

export default GetBasketSelectableCommand
