import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class TeleportToPositionCommand
 * @classdesc command for teleporting.
 */
class TeleportToPositionCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Object} position - The position to teleport to.
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
        options.teleportTo(this.position);
    }
}

export default TeleportToPositionCommand
