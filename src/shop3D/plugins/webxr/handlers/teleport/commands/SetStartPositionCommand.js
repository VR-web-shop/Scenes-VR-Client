import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class SetStartPositionCommand
 * @classdesc command for setting the start position.
 */
class SetStartPositionCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Object} position - The start position.
     */
    constructor(position) {
        super()

        if (!(position instanceof THREE.Vector3)) {
            throw new Error('The position must be an instance of THREE.Vector3')
        }

        this.position = position
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        options.startPosition.copy(this.position)
    }
}

export default SetStartPositionCommand
