import Command from "../../abstractions/commands/Command.js";

/**
 * @class LoadLightCommand
 * @classdesc Command for loading a light.
 * @extends Command
 * @property options - The options for the command.
 */
class LoadLightCommand extends Command {

    /**
     * @constructor
     * @param {String} type - The type of the light.
     * @param {String} color - The color of the light.
     * @param {Number} intensity - The intensity of the light.
     * @param {Object} position - The position of the light.
     * @param {String} name - The name of the light (optional).
     */
    constructor(type, color, intensity, position, name= null) {
        super()
        this.type = type
        this.color = color
        this.intensity = intensity
        this.position = position
        this.name = name
    }

    /**
     * @function execute
     * @description Load a light.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const lights = options.plugins.find('lights')
        const light = lights.loadLight(this.type, this.color, this.intensity, this.position)
    
        if (this.name) {
            light.name = this.name
        }
    }
}

export default LoadLightCommand
