
/**
 * @abstract
 * @class WebXRHandlerCommand
 * @classdesc Abstract class for commands.
 */
class WebXRHandlerCommand {

    /**
     * @function execute
     * @description Execute the command.
     * @abstract
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        throw new Error('WebXRHandlerCommand.execute() must be overridden')
    }
}

export default WebXRHandlerCommand
