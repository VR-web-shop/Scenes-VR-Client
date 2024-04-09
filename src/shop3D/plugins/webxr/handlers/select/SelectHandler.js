import WebXRHandler from '../../abstractions/WebXRHandler.js'
import Selectable from './Selectable.js'
import SocketMesh from './sockets/SocketMesh.js'
import * as THREE from 'three'

/**
 * @property selectables - The selectables.
 */
const selectables = []

/**
 * @property controllerSockets - The controller sockets.
 */
const controllerSockets = []

/**
 * @function updateLoop
 * @description Update the loop.
 * @returns {void}
 */
function updateLoop() {
    for (let i = 0; i < controllerSockets.length; i++) {
        controllerSockets[i].updateSelectedPosition()
    }
}

function select(event) {
    const controller = event.target
    const socket = controllerSockets.find(socket => socket.mesh.uuid === controller.uuid)
    const selectable = socket.intersect(selectables)
    if (selectable) socket.setSelected(selectable)
    else socket.removeSelected()
}

function deselect(event) {
    const controller = event.target
    const socket = controllerSockets.find(socket => socket.mesh.uuid === controller.uuid)
    socket.removeSelected()
}

function deselectAll() {
    for (let i = 0; i < controllerSockets.length; i++) {
        controllerSockets[i].removeSelected()
    }
}

/**
 * @class SelectHandler
 * @classdesc The select handler.
 */
class SelectHandler extends WebXRHandler {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function init
     * @description Initialize the handler.
     * @param {Object} view - The view.
     * @param {Object[]} controllers - The controllers.
     * @returns {void}
     */
    init(view, controllers) {
        this.controllers = controllers
        this.view = view

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]
            const controllerSocket = new SocketMesh(controller)

            controller.addEventListener('squeezestart', select)
            controller.addEventListener('squeezeend', deselect)

            controllerSockets.push(controllerSocket)
        }

        // Note: If the xr session is ended, clear the selected.
        this.view.renderer.xr.addEventListener('sessionend', deselectAll)
        this.view.addBeforeRenderListener(updateLoop)
        this.initInvoker({ selectables, controllerSockets })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        for (let i = 0; i < controllerSockets.length; i++) {
            const controllerSocket = controllerSockets[i]
            const controller = controllerSocket.controller

            controller?.removeEventListener('squeezestart', select)
            controller?.removeEventListener('squeezeend', deselect)
        }

        selectables.length = 0
        controllerSockets.length = 0
        this.view.renderer.xr.removeEventListener('sessionend', deselectAll)
        this.view.removeBeforeRenderListener(updateLoop)
    }
}

export default SelectHandler
