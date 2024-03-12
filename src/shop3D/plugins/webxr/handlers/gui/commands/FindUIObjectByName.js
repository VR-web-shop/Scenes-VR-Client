import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class FindUIObjectByName
 * @classdesc command for finding UI object by name.
 */
class FindUIObjectByName extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {string} name - The name of the UI element to be found.
     */
    constructor(name) {
        super()

        if (typeof name !== 'string') {
            throw new Error('The name must be a string')
        }

        this.name = name
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        return options.uiObjects.find(obj => obj.mesh.name === this.name)
    }
}

export default FindUIObjectByName
