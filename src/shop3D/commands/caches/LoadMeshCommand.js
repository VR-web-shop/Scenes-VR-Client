import Command from "../../abstractions/commands/Command.js";
import CachesPlugin from "../../plugins/CachesPlugin.js";

/**
 * @class LoadObject3DCommand
 * @classdesc Command for loading a 3D object.
 * @extends Command
 * @property options - The options for the command.
 */
class LoadMeshCommand extends Command {

    /**
     * @constructor
     * @param {String} src - The source of the 3D object.
     * @param {Array} submeshes - The submeshes of the 3D object.
     * @param {Object} position - The position of the 3D object.
     * @param {Object} rotation - The rotation of the 3D object.
     * @param {Object} scale - The scale of the 3D object.
     * @param {String} name - The name of the 3D object (optional).
     */
    constructor(src, submeshes = [], position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, name = null) {
        super()
        this.src = src
        this.submeshes = submeshes
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.name = name
    }

    /**
     * @function execute
     * @description Load a 3D object.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const mesh = await CachesPlugin.loadMesh(this.src, this.submeshes)

        mesh.position.set(this.position.x, this.position.y, this.position.z)
        mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
        mesh.scale.set(this.scale.x, this.scale.y, this.scale.z)

        if (this.name) {
            mesh.name = this.name
        }
        
        options.view.scene.add(mesh)
    }
}

export default LoadMeshCommand
