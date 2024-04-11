import Plugin from "../abstractions/plugins/Plugin.js";

/**
 * @class search plugin
 * @classdesc The plugin for searching.
 * @extends Plugin
 * @property {string} name - The name of the plugin.
 * @property {Object} view - The view of the shop.
 */
class SearchPlugin extends Plugin {

    /**
     * @constructor
     */
    constructor() {
        super('search')
    }

    /**
     * @function init
     * @description Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
		super.init(view)
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
    }

    /**
     * @function searchByName
     * @description Search for an object.
     * @param {string} name - The name of the object.
     * @returns {Object} The object.
     */
    searchByName(name) {
        for (let i = 0; i < this.view.scene.children.length; i++) {
            if (this.view.scene.children[i].name === name) {
                return this.view.scene.children[i]
            }
        }

        return null
    }

    /**
     * @function searchByUUID
     * @description Search for an object.
     * @param {string} uuid - The UUID of the object.
     * @returns {Object} The object.
     */
    searchByUUID(uuid) {
        for (let i = 0; i < this.view.scene.children.length; i++) {
            if (this.view.scene.children[i].uuid === uuid) {
                return this.view.scene.children[i]
            }
        }

        return null
    }

    /**
     * @function search
     * @description Search for an object.
     * @param {Object} options - The options for the search.
     * @returns {Object} The object.
     * @throws {Error} Invalid search parameters.
     * @example search({ name: 'name' })
     * @example search({ uuid: 'uuid' })
     */
    search(options) {
        let mesh = null
        if (options.name) {
            mesh = this.searchByName(options.name)
        } else if (options.uuid) {
            mesh = this.searchByUUID(options.uuid)
        } else {
            throw new Error('Invalid search parameters, possible options are name or uuid.')
        }

        if (!mesh) {
            throw new Error('Mesh not found.')
        }

        return mesh
    }
}

export default SearchPlugin
