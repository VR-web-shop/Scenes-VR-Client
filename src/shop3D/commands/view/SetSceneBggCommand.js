import Command from "../../abstractions/commands/Command.js";
import * as THREE from 'three'

/**
 * @class SetSceneBggCommand
 * @classdesc Command for setting the scene background.
 * @extends Command
 * @property options - The options for the command.
 */
class SetSceneBggCommand extends Command {

    /**
     * @constructor
     * @param {Object} options - The options for the command.
     * possible parameters are: color, cubeTexture
     * Note: Select only one parameter.
     * @example new SetSceneBggCommand( { color: 0x000000 } )
     * @example new SetSceneBggCommand( { cubeTexture: 'path/to/cubeTexture' px: 'px.jpg', nx: 'nx.jpg', py: 'py.jpg', ny: 'ny.jpg', pz: 'pz.jpg', nz: 'nz.jpg' } )
     */
    constructor(options) {
        super()
        this.options = options
    }

    /**
     * @function execute
     * @description Set the scene background.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const scene = options.view.scene

        if (this.options.color) {
            scene.background = new THREE.Color(this.options.color)
        } else if (this.options.cubeTexture) {
            const loader = new THREE.CubeTextureLoader()
            loader.setPath(this.options.cubeTexture)
            const texture = loader.load([
                this.options.px,
                this.options.nx,
                this.options.py,
                this.options.ny,
                this.options.pz,
                this.options.nz
            ])
            scene.background = texture
        } else {
            throw new Error('Invalid options for setting the scene background.')
        }
    }
}

export default SetSceneBggCommand
