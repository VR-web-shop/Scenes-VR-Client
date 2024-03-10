import Plugin from "../abstractions/plugins/Plugin.js";
import * as THREE from 'three';

/**
 * @class lights plugin
 * @classdesc The plugin for the lights.
 * @extends Plugin
 * @property {Object} view - The view of the shop.
 * @property {Array} lights - The list of lights.
 */
class LightsPlugin extends Plugin {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function init
     * @description Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
        this.view = view
        this.lights = []
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
        for (let i = 0; i < this.lights.length; i++) {
            this.view.scene.remove(this.lights[i])
        }

        this.lights = []
    }

    /**
     * @function loadLight
     * @description Load a light.
     * @param {Object} options - The options for the light.
     * @returns {void}
     */
    loadLight(type, color, intensity, position) {
        const light = new THREE[type](intensity)
        light.color.set(color)
        light.position.set(position.x, position.y, position.z)
        this.view.scene.add(light)
        this.lights.push(light)
        return light
    }

    /**
     * @function removeLightByName
     * @description Remove a light by name.
     * @param {String} name - The name of the light.
     * @returns {void}
     */
    removeLightByName(name) {
        const light = this.lights.find(light => light.name === name)
        this.view.scene.remove(light)
        this.lights = this.lights.filter(light => light.name !== name)

        return light
    }

    /**
     * @function removeLightByUUID
     * @description Remove a light by UUID.
     * @param {String} uuid - The UUID of the light.
     * @returns {void}
     */
    removeLightByUUID(uuid) {
        const light = this.lights.find(light => light.uuid === uuid)
        this.view.scene.remove(light)
        this.lights = this.lights.filter(light => light.uuid !== uuid)

        return light
    }

    /**
     * @function removeLightByType
     * @description Remove a light by type.
     * @param {String} type - The type of the light.
     * @returns {void}
     */
    removeLightByType(type) {console.log(this.view)
        const light = this.lights.find(light => light.type === type)
        this.view.scene.remove(light)
        this.lights = this.lights.filter(light => light.type !== type)
        
        return light
    }
}

export default LightsPlugin
