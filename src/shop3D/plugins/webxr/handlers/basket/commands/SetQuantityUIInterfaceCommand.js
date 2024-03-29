import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class SetQuantityUIInterfaceCommand
 * @classdesc command for setting the basket's quantity UI interface.
 */
class SetQuantityUIInterfaceCommand extends WebXRHandlerCommand {

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
        options.quantityUI = this.uiInterface
    }
}

export default SetQuantityUIInterfaceCommand
