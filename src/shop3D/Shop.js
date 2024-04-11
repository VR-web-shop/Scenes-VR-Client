import Manager from "./abstractions/Manager.js";

import PrimitivesPlugin from "./plugins/PrimitivesPlugin.js";
import CachesPlugin from "./plugins/CachesPlugin.js";
import LightsPlugin from "./plugins/LightsPlugin.js";
import SearchPlugin from "./plugins/SearchPlugin.js";
import WebXRPlugin from "./plugins/webxr/WebXRPlugin.js";

import InitializeState from "./states/InitializeState.js";
import ExecuteState from "./states/ExecuteState.js";
import ExitState from "./states/ExitState.js";

import View3D from "./View3D.js";

/**
 * @class Shop
 * @classdesc The shop.
 * @property start - The function to start the shop.
 * @property stop - The function to stop the shop.
 * @property invoke - The function to execute a command.
 */
const Shop = function(view = new View3D()) {
	if (!(view instanceof View3D)) {
		throw new Error('view must be an instance of View3D')
	}
    const manager = new Manager(view)

    manager.addPlugin(new PrimitivesPlugin())
    manager.addPlugin(new LightsPlugin())
    manager.addPlugin(new SearchPlugin())
    manager.addPlugin(new CachesPlugin())
    manager.addPlugin(new WebXRPlugin())

    /**
     * @function isStopped
     * @description Check if the shop is stopped.
     * @returns {boolean}
     * @private
     */
    const isStopped = function() {
        return manager.getState() instanceof ExitState
    }

    /**
     * @function isRunning
     * @description Check if the shop is running.
     * @returns {boolean}
     * @private
     */
    const isRunning = function() {
        return manager.getState() instanceof ExecuteState
    }

    /**
     * @function start
     * @description Start the shop.
     * @param {HTMLCanvasElement} canvas - The canvas to render the shop. (optional)
     * @returns {void}
     * @public
     */
    this.start = function(canvas=null) {
        if (isRunning()) {
            throw new Error('The shop is already running')
        }

        view.init(canvas)
        manager.setState(new InitializeState())
    }

    /**
     * @function stop
     * @description Stop the shop.
     * @returns {void}
     * @public
     */
    this.stop = function() {
        if (isStopped()) {
            throw new Error('The shop is already stopped')
        }

        if (!isRunning()) {
            throw new Error('The shop is not running')
        }

        manager.setState(new ExitState())
    }

    /**
     * @function invoke
     * @description Execute a command.
     * @param {Command} command - The command to be executed.
     * @returns {void}
     * @public
     * @async
     */
    this.invoke = async (command) => {
        await manager.invoke(command)
    }

	this._manager = manager;
	this._view = view
}

export default Shop
