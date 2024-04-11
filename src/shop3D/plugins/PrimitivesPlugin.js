import Plugin from "../abstractions/plugins/Plugin.js";
import * as THREE from 'three';

/**
 * @class Primitives plugin
 * @classdesc The plugin for the primitives.
 * @extends Plugin
 * @property {string} name - The name of the plugin.
 * @property {Object} view - The view of the shop.
 * @property {Array} primitives - The list of primitives.
 */
class PrimitivesPlugin extends Plugin {

    /**
     * @constructor
     */
    constructor() {
        super('primitives')
    }

    /**
     * @function init
     * @description Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
        this.view = view
        this.primitives = []
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
        for (let i = 0; i < this.primitives.length; i++) {
            this.view.scene.remove(this.primitives[i])
        }

        this.primitives = []
    }

    /**
     * @function loadPrimitive
     * @description Load a primitive.
     * @param {String} type - The type of the primitive.
     * @param {Object} options - The options for the primitive.
     * @returns {void}
     */
    loadPrimitive(type, options, material) {
        let geometry = null
        if (type === 'PlaneGeometry') {
            geometry = new THREE.PlaneGeometry(options.width, options.height)
        } else {
            throw new Error('Unknown primitive type')
        }
        const primitive = new THREE.Mesh(geometry, material)
        this.view.scene.add(primitive)
        this.primitives.push(primitive)
        return primitive
    }

    /**
     * @function findPrimitiveByName
     * @description Find a primitive by name.
     * @param {String} name - The name of the primitive.
     * @returns {Object}
     */
    findPrimitiveByName(name) {
        return this.primitives.find(p => p.name === name)
    }

    /**
     * @function findPrimitiveByUUID
     * @description Find a primitive by UUID.
     * @param {String} uuid - The UUID of the primitive.
     * @returns {Object}
     */
    findPrimitiveByUUID(uuid) {
        return this.primitives.find(p => p.uuid === uuid)
    }

    /**
     * @function removePrimitiveByName
     * @description Remove a primitive by name.
     * @param {String} name - The name of the primitive.
     * @returns {void}
     */
    removePrimitiveByName(name) {
        const primitive = this.primitives.find(p => p.name === name)
        this.view.scene.remove(primitive)
        this.primitives = this.primitives.filter(p => p.name !== name)

        return primitive
    }

    /**
     * @function removePrimitiveByUUID
     * @description Remove a primitive by UUID.
     * @param {String} uuid - The UUID of the primitive.
     * @returns {void}
     */
    removePrimitiveByUUID(uuid) {
        const primitive = this.primitives.find(p => p.uuid === uuid)
        this.view.scene.remove(primitive)
        this.primitives = this.primitives.filter(p => p.uuid !== uuid)

        return primitive
    }
}

export default PrimitivesPlugin
