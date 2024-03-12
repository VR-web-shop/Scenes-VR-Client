import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class SetBasketUIInterfaceCommand
 * @classdesc command for setting the basket's UI interface.
 */
class SetBasketUIInterfaceCommand extends WebXRHandlerCommand {

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
        options.basket.setUIInterface(this.uiInterface);
    }
}

export default SetBasketUIInterfaceCommand
