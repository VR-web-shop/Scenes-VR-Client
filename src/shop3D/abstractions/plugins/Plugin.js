
/**
 * @class Plugin
 * @description Base class for all plugins
 * @property {Object} view - The view of the shop.
 */
class Plugin {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @function init
     * @description Called when the shop is started. Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
    }

    /**
     * @function exit
     * @description Called when the shop is stopped. Dispose the plugin.
     * @returns {void}
     */
    exit() {
    }
}

export default Plugin
