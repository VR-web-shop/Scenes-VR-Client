import WebXRHandler from '../../abstractions/WebXRHandler.js'
import FollowObject from './FollowObject.js'

/**
 * @property followObjects - All the follow objects.
 */
const followObjects = []

/**
 * @function followLoop
 * @description The follow loop.
 * @returns {void}
 */
function followLoop() {
    for (let i = 0; i < followObjects.length; i++) {
        const followObject = followObjects[i]
        followObject.follow()
    }
}

/**
 * @class FollowHandler
 * @classdesc The Follow handler.
 */
class FollowHandler extends WebXRHandler {

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
        this.view.addBeforeRenderListener(followLoop)
        this.initInvoker({ view, followObjects })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        followObjects.length = 0
        this.view.removeBeforeRenderListener(followLoop)
    }
}

export default FollowHandler
