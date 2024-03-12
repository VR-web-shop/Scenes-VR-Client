import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class RemoveCheckoutCommand
 * @classdesc command for removing a checkout.
 */
class RemoveCheckoutCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The checkout's object3D.
     */
    constructor(object3D) {
        super()

        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        this.object3D = object3D
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        const index = options.checkouts.findIndex(checkout => checkout.mesh.uuid === this.object3D.uuid);
        if (index !== -1) {
            options.checkouts.splice(index, 1);
        }
    }
}

export default RemoveCheckoutCommand
