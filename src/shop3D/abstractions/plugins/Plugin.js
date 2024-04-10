
/**
 * @class Plugin
 * @description Base class for all plugins
 * @property {string} name - The name of the plugin.
 * @property {Object} view - The view of the shop.
 */
class Plugin {

    /**
     * @constructor
	 * @param {string} name - the name of the plugin
	 * @trows {Error} error - if name is not a string
     */
    constructor(name) {	
        if (typeof name !== 'string') {
            throw new Error('The name must be a string')
        }

		this.name = name
    }

    /**
     * @function init
     * @description Called when the shop is started. Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     * @abstract
     */
    init(view) {
		this.view = view
    }

    /**
     * @function exit
     * @description Called when the shop is stopped. Dispose the plugin.
     * @returns {void}
	 * @abstract
     */
    exit() {
    }
}

export default Plugin
