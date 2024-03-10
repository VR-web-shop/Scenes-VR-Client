import Command from "../../abstractions/commands/Command.js";
import CachesPlugin from "../../plugins/CachesPlugin.js";

/**
 * @class RemoveMeshCommand
 * @classdesc Command for removing a mesh.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveMeshCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search parameters for the mesh.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     */
    constructor(search={}) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a light.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        let mesh = null
        if (this.search.name) {
            mesh = CachesPlugin.removeByName('meshes', this.search.name)
        } else if (this.search.uuid) {
            mesh = CachesPlugin.removeByUUID('meshes', this.search.uuid)
        } else {
            throw new Error('Invalid search parameters for mesh removal.')
        }

        if (mesh) {
            options.view.scene.remove(mesh)
        }
    }
}

export default RemoveMeshCommand
