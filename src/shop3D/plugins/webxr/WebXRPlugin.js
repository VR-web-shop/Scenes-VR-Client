import Plugin from "../../abstractions/plugins/Plugin.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import * as THREE from 'three';

import TeleportHandler from './TeleportHandler.js';
import SelectHandler from './SelectHandler.js';
import BasketHandler from "./BasketHandler.js";

/**
 * @class WebXR plugin
 * @classdesc The plugin for handling WebXR.
 * @extends Plugin
 * @property {Object} view - The view of the shop.
 * @property {Object} button - The button for activating WebXR.
 * @property {Array} controllers - The list of controllers.
 * @property {Array} floor - The list of floor meshes.
 * @property {Array} selectables - The list of selectables.
 */
class WebXRPlugin extends Plugin {

    /**
     * @constructor
     */
    constructor() {
        super()
        this.handlers = {
            teleport: new TeleportHandler(this),
            select: new SelectHandler(this),
            basket: new BasketHandler(this)
        }
    }

    sessionStarted() {
        Object.values(this.handlers).forEach(handler => handler.sessionStarted())
    }

    sessionEnded() {
        Object.values(this.handlers).forEach(handler => handler.sessionEnded())
    }

    /**
     * @function init
     * @description Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
        this.view = view
        this.view.renderer.xr.addEventListener('sessionstart', this.sessionStarted.bind(this))
        this.view.renderer.xr.addEventListener('sessionend', this.sessionEnded.bind(this))
        this.view.renderer.xr.enabled = true
        this.button = VRButton.createButton(this.view.renderer)
        this.controllers = [
            this.view.renderer.xr.getController(0),
            this.view.renderer.xr.getController(1)
        ]

        const modelFactory = new XRControllerModelFactory()
        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.add( modelFactory.createControllerModel( controller ) );
            controller.addEventListener('selectstart', this.handlers.teleport.start.bind(this.handlers.teleport))
            controller.addEventListener('selectend', this.handlers.teleport.stop.bind(this.handlers.teleport))
            controller.addEventListener('squeezestart', this.handlers.select.start.bind(this.handlers.select))
            controller.addEventListener('squeezeend', this.handlers.select.stop.bind(this.handlers.select))
            controller.addEventListener('squeezestart', this.handlers.basket.start.bind(this.handlers.basket))
            controller.addEventListener('squeezeend', this.handlers.basket.stop.bind(this.handlers.basket))

            this.view.scene.add(controller)
        }

        document.body.appendChild(this.button);
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
        this.view.renderer.xr.enabled = false
        this.button.remove()
        this.button = null
        this.controllers = []
    }

    /**
     * @function getHandler
     * @description Get a handler by name.
     * @param {String} name - The name of the handler.
     * @returns {Object}
     */
    getHandler(name) {
        return this.handlers[name]
    }
}

export default WebXRPlugin
