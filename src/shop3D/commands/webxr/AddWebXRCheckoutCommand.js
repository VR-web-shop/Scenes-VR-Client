import Command from "../../abstractions/commands/Command.js";
import * as THREE from "three";

/**
 * @class AddWebXRCheckoutCommand
 * @classdesc Command for adding a webxr checkout.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRCheckoutCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the object 3d.
     * @param {THREE.Vector3} surfaceOffset - The offset for the surface.
     * @param {THREE.Vector3} surfaceSize - The size for the surface.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRCheckoutCommand( { name: 'meshName' } )
     * @example new AddWebXRCheckoutCommand( { uuid: 'meshUUID' } )
     */
    constructor(search, surfaceOffset = {x: 0, y: 0, z: 0}, surfaceSize = {x: 1, y: 1, z: 1}) {
        super()
        this.search = search
        this.surfaceOffset = surfaceOffset
        this.surfaceSize = surfaceSize
    }

    /**
     * @function execute
     * @description Add a webxr checkout.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const offset = new THREE.Vector3(this.surfaceOffset.x, this.surfaceOffset.y, this.surfaceOffset.z)
        const size = new THREE.Vector3(this.surfaceSize.x, this.surfaceSize.y, this.surfaceSize.z)
        const mesh = options.plugins
            .find('search')
            .search(this.search)
        
        options.plugins
            .find('webxr')
            .getHandler('basket')
            .addCheckout(mesh, offset, size)
    }
}

export default AddWebXRCheckoutCommand
