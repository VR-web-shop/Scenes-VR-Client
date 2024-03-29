import Command from "../../abstractions/commands/Command.js";
import SetStartPositionCommand from "../../plugins/webxr/handlers/teleport/commands/SetStartPositionCommand.js";
import * as THREE from 'three'

/**
 * @class SetWebXRStartPositionCommand
 * @classdesc Command for setting the start position of a webxr character.
 * @extends Command
 * @property options - The options for the command.
 */
class SetWebXRStartPositionCommand extends Command {

    /**
     * @constructor
     * @param {Object} position - The position to set.
     */
    constructor(position) {
        super()
        
        this.position = position
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const teleportHandler = webxrPlugin.getHandler('teleport')
        const position = new THREE.Vector3(this.position.x, this.position.y, this.position.z)
        await teleportHandler.invoke(new SetStartPositionCommand(position))
    }
}

export default SetWebXRStartPositionCommand
