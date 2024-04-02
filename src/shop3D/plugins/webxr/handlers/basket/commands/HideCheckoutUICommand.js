import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class HideCheckoutUICommand
 * @classdesc command for hiding the basket's checkout UI.
 */
class HideCheckoutUICommand extends WebXRHandlerCommand {

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
        options.checkoutUI.hide()
    }
}

export default HideCheckoutUICommand
