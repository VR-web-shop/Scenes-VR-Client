import Command from "../../abstractions/commands/Command.js";
import TeleportToPositionCommand from "../../plugins/webxr/handlers/teleport/commands/TeleportToPositionCommand.js";
import * as THREE from 'three'

/**
 * @class TeleportWebXRCharacter
 * @classdesc Command for teleporting a webxr character.
 * @extends Command
 * @property options - The options for the command.
 */
class TeleportWebXRCharacter extends Command {

    /**
     * @constructor
     * @param {Object} position - The position to teleport to.
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
        await teleportHandler.invoke(new TeleportToPositionCommand(position))
    }
}

export default TeleportWebXRCharacter
