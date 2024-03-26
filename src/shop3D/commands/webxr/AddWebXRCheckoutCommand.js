import Command from "../../abstractions/commands/Command.js";
import AddCheckoutCommand from "../../plugins/webxr/handlers/basket/commands/AddCheckoutCommand.js";
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
     * @param {Object} surfaceOffset - The offset for the surface.
     * @param {Object} surfaceSize - The size for the surface.
     * @param {Object} UIOffset - The offset for the UI shown at the checkout.
     * @param {Object} UIRotation - The rotation for the UI shown at the checkout.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRCheckoutCommand( { name: 'meshName' } )
     * @example new AddWebXRCheckoutCommand( { uuid: 'meshUUID' } )
     */
    constructor(
        search, 
        surfaceOffset = {x: 0, y: 0, z: 0}, 
        surfaceSize = {x: 1, y: 1, z: 1},
        UIOffset = {x: 0, y: 0, z: 0},
        UIRotation = {x: 0, y: 0, z: 0}) {
        super()
        this.search = search
        this.surfaceOffset = surfaceOffset
        this.surfaceSize = surfaceSize
        this.UIOffset = UIOffset
        this.UIRotation = UIRotation
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
        const UIOffset = new THREE.Vector3(this.UIOffset.x, this.UIOffset.y, this.UIOffset.z)
        const UIRotation = new THREE.Euler(this.UIRotation.x, this.UIRotation.y, this.UIRotation.z)
        
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const basketHandler = webxrPlugin.getHandler('basket')
        const mesh = searchPlugin.search(this.search)
        
        await basketHandler.invoke(new AddCheckoutCommand(mesh, offset, size, UIOffset, UIRotation))
    }
}

export default AddWebXRCheckoutCommand
