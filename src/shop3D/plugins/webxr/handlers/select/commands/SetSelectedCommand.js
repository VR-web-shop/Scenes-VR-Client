import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import Selectable from "../Selectable.js";
import * as THREE from 'three'

/**
 * @class SetSelectedCommand
 * @classdesc command for setting a selectable as selected.
 */
class SetSelectedCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} controller - The controller that is selecting.
     * @param {Selectable} selectable - The selectable to be set as selected.
     */
    constructor(controller, selectable) {
        super()

        if (!(controller instanceof THREE.Object3D)) {
            throw new Error('The controller must be an instance of THREE.Object3D')
        }

        if (!(selectable instanceof Selectable)) {
            throw new Error('The selectable is not an instance of Selectable')
        }

        this.controller = controller
        this.selectable = selectable
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        const controllerSockets = options.controllerSockets
        const socket = controllerSockets.find(socket => socket.mesh.uuid === this.controller.uuid)

        if (!socket) {
            throw new Error('The controller does not have a socket')
        }

        socket.setSelected(this.selectable)
    }
}

export default SetSelectedCommand
