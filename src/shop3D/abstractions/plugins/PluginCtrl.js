import Plugin from "./Plugin.js"

/**
 * @class PluginCtrl
 * @classdesc The controller for the plugins.
 */
const PluginCtrl = function () {
    const plugins = {}
    
    /**
     * @function add
     * @description Add a plugin to the controller.
     * @param {string} name - The name of the plugin.
     * @param {Plugin} plugin - The plugin to be added.
     * @returns {void}
     * @throws {Error} - If the name is not a string.
     * @throws {Error} - If the plugin already exists.
     * @throws {Error} - If the plugin is not an instance of Plugin.
     */
    this.add = function (name, plugin) {
        if (typeof name !== 'string') {
            throw new Error('Invalid name')
        }

        if (plugins[name.toLowerCase()]) {
            throw new Error('Plugin already exists')
        }
        
        if (!(plugin instanceof Plugin)) {
            throw new Error('Invalid plugin')
        }
        
        plugins[name.toLowerCase()] = plugin
    }

    /**
     * @function remove
     * @description Remove a plugin from the controller.
     * @param {string} name - The name of the plugin.
     * @returns {void}
     * @throws {Error} - If the name is not a string.
     * @throws {Error} - If the plugin does not exist.
     */
    this.remove = function (name) {
        if (typeof name !== 'string') {
            throw new Error('Invalid name')
        }

        if (!plugins[name.toLowerCase()]) {
            throw new Error('Plugin does not exist')
        }

        delete plugins[name.toLowerCase()]
    }

    /**
     * @function find
     * @description Find a plugin by name.
     * @param {string} name - The name of the plugin.
     * @returns {Plugin} The plugin.
     * @throws {Error} - If the name is not a string.
     */
    this.find = function (name) {
        if (typeof name !== 'string') {
            throw new Error('Invalid name')
        }

        return plugins[name.toLowerCase()]
    }

    /**
     * @function init
     * @description Initialize all the plugins.
     * @param {Object} options - The options for the plugins.
     */
    this.init = function (options) {
        Object.values(plugins).forEach(element => element.init(options))
    }

    /**
     * @function exit
     * @description Dispose all the plugins.
     * @param {Object} options - The options for the plugins.
     */
    this.exit = function (options) {
        Object.values(plugins).forEach(element => element.exit(options))
    }
}

export default PluginCtrl
