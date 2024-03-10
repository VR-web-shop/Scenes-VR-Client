import Command from "../../abstractions/commands/Command.js";
import CachesPlugin from "../../plugins/CachesPlugin.js";

/**
 * @class LoadPrimitiveCommand
 * @classdesc Command for adding a 3D object.
 * @extends Command
 * @property options - The options for the command.
 */
class LoadPrimitiveCommand extends Command {

    /**
     * @constructor
     * @param {String} type - The type of the primitive.
     * @param {String} options - The options for the primitive.
     * @param {Object} material - The material for the primitive.
     * @param {Object} position - The position of the 3D object.
     * @param {Object} rotation - The rotation of the 3D object.
     * @param {Object} scale - The scale of the 3D object.
     * @param {String} name - The name of the 3D object (optional).
     */
    constructor(type, options = {}, material = {}, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, name= null) {
        super()
        this.type = type
        this.options = options
        this.material = material
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.name = name
    }

    /**
     * @function execute
     * @description Load a primitive.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const plugin = options.plugins.find('primitives')
        const material = await CachesPlugin.loadMaterial(this.material.type, this.material.textures)
        const mesh = await plugin.loadPrimitive(this.type, this.options, material)

        mesh.position.set(this.position.x, this.position.y, this.position.z)
        mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
        mesh.scale.set(this.scale.x, this.scale.y, this.scale.z)

        if (this.name) {
            mesh.name = this.name
        }
    }
}

export default LoadPrimitiveCommand
