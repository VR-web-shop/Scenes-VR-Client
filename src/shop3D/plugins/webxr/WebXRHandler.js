
/**
 * @class WebXRHandler
 * @classdesc The base class for handling WebXR sessions.
 * @property {Object} view - The view of the shop.
 * @property {Array} controllers - The list of controllers.
 */
class WebXRHandler {
    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @function init
     * @description Called when the plugin is initialized.
     * @returns {void}
     */
    init(view, controllers) {
        this.view = view
        this.controllers = controllers
    }

    /**
     * @function exit
     * @description Called when the plugin is exited.
     * @returns {void}
     * @abstract
     */
    exit() {
    }
}

export default WebXRHandler
