import Plugin from "../../abstractions/plugins/Plugin.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

import TeleportHandler from './handlers/teleport/TeleportHandler.js';
import SelectHandler from './handlers/select/SelectHandler.js';
import BasketHandler from "./handlers/basket/BasketHandler.js";

/**
 * Why handlers instead of new plugins?
 * Because functionality such as teleport, or select 
 * doesn't make sense without the context of WebXR.
 */
const handlers = {
    teleport: new TeleportHandler(),
    select: new SelectHandler(),
    basket: new BasketHandler()
}

/**
 * @function createControllers
 * @description Create the controllers with models.
 * @param {Object} view - The view of the shop.
 * @returns {Array} The list of controllers.
 */
function createControllers(view) {
    const xr = view.renderer.xr
    const scene = view.scene
    const controllers = [xr.getController(0), xr.getController(1)]
    const modelFactory = new XRControllerModelFactory()
    for (let i = 0; i < controllers.length; i++) {
        const controllerModel = modelFactory.createControllerModel(controllers[i])

        controllers[i].add(controllerModel);
        scene.add(controllers[i])
    }

    return controllers
}

/**
 * @function initXR
 * @description Initialize WebXR.
 * @param {Object} view - The view of the shop.
 * @returns {void}
 * @private
 */
function initXR(view) {
    const controllers = createControllers(view)

    Object.values(handlers).forEach(handler => handler.init(view, controllers))
    view.renderer.xr.enabled = true
}

/**
 * @function exitXR
 * @description Dispose WebXR.
 * @param {Object} view - The view of the shop.
 * @returns {void}
 * @private
 */
function exitXR(view) {
    Object.values(handlers).forEach(handler => handler.exit())
    view.renderer.xr.enabled = false
}

/**
 * @class WebXR plugin
 * @classdesc The plugin for handling WebXR.
 * @extends Plugin
 * @property {Object} view - The view of the shop.
 * @property {Object} button - The button for activating WebXR.
 */
class WebXRPlugin extends Plugin {

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
        this.button = (() => {
            const btn = VRButton.createButton(view.renderer)
            document.body.appendChild(btn)
            return btn
        })()

        initXR(view)
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
        exitXR(this.view)
        this.view = null

        this.button.remove()
        this.button = null
    }

    /**
     * @function getHandler
     * @description Get a handler by name.
     * @param {String} name - The name of the handler.
     * @returns {Object}
     */
    getHandler(name) {
        return handlers[name]
    }
}

export default WebXRPlugin
