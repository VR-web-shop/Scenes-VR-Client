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
     * @param {Object} position - The position of the camera.
     * @param {Object} rotation - The rotation of the camera.
     * @param {Object} target - The target of the camera.
     */
    constructor(position, rotation = null, target = null) {
        super()
        this.position = position
        this.rotation = rotation
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

        if (this.rotation) {
            camera.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
        }

        if (this.target) {
            camera.lookAt(this.target.x, this.target.y, this.target.z)
        }

        options.view.cameraYRotation = camera.rotation.y
    }
}

export default SetCameraCommand
