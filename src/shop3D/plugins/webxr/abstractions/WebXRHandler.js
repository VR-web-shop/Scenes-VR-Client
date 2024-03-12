import WebXRHandlerInvoker from "./WebXRHandlerInvoker.js"

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
     * @function initInvoker
     * @description Initialize the invoker.
     * @param {Object} options - The options for the invoker.
     * @returns {void}
     */
    initInvoker(options) {
        this.invoker = new WebXRHandlerInvoker(options)
    }

    /**
     * @function exit
     * @description Called when the plugin is exited.
     * @returns {void}
     * @abstract
     */
    exit() {
    }

    /**
     * @function invoke
     * @description Execute a command.
     * @param {Object} command - The command to be executed.
     * @returns {void}
     * @async
     */
    async invoke(command) {
        if (!this.invoker) {
            throw new Error('The invoker is not initialized, call initInvoker() first')
        }

        return await this.invoker.invoke(command)
    }
}

export default WebXRHandler

