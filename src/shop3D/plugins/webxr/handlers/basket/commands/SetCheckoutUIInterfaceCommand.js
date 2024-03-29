import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import CheckoutUI from "../CheckoutUI.js";
/**
 * @class SetBasketUIInterfaceCommand
 * @classdesc command for setting the basket's UI interface.
 */
class SetCheckoutUIInterfaceCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Object} uiInterface - The checkout's UI interface
     */
    constructor(uiInterface) {
        super()

        if (!(uiInterface instanceof Object)) {
            throw new Error('The uiInterface must be an instance of Object')
        }

        this.uiInterface = uiInterface
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        CheckoutUI.setCheckoutInterface(this.uiInterface)
    }
}

export default SetCheckoutUIInterfaceCommand
