import Command from "../../abstractions/commands/Command.js";

/**
 * @class SetCameraCommand
 * @classdesc Command for setting the camera.
 * @extends Command
 * @property options - The options for the command.
 */
class SetCameraCommand extends Command {

    /**
     * @constructor
     * @param {Object} position - The position of the light.
     * @param {Object} target - The target of the light.
     */
    constructor(position, target = { x: 0, y: 0, z: 0 }) {
        super()
        this.position = position
        this.target = target
    }

    /**
     * @function execute
     * @description Set the camera position.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const camera = options.view.camera

        camera.position.set(this.position.x, this.position.y, this.position.z)
        camera.lookAt(this.target.x, this.target.y, this.target.z)
    }
}

export default SetCameraCommand
