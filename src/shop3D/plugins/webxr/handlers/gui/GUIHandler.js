import SpatialUI from './spatialui/SpatialUI.js'
import SpatialUIElement, { SelectableSpatialUIElement } from './spatialui/SpatialUIElement.js'
import WebXRHandler from '../../abstractions/WebXRHandler.js'
import GUISelector from './GUISelector.js'

/**
 * @property uiObjects - All the UI objects.
 */
const uiObjects = []

/**
 * @property uiSelectables - The UI objects that are selectable.
 */
const uiSelectables = []

/**
 * @property _view - The view.
 */
let _view = null

/**
 * @property guiSelector - The GUI selector.
 */
let guiSelector = null

function onCollision(e) {
    const { before, after } = e
    
    if (before) {
        const selectable = uiSelectables.find(selectable => selectable.object3D.uuid === before.uuid)
        if (selectable) selectable.onPointerOut()
    }

    if (after) {
        const selectable = uiSelectables.find(selectable => selectable.object3D.uuid === after.uuid)
        if (selectable) selectable.onPointerOver()
    }
}

/**
 * @function startSelecting
 * @description Start selecting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function startSelecting(event) {
    if (guiSelector) return

    function getUIInteractables() {
        const activeSelectables = uiSelectables.filter(selectable => selectable.isActive())
        return activeSelectables.map(selectable => selectable.object3D)
    }

    guiSelector = new GUISelector(event.target, _view, getUIInteractables)
    guiSelector.addCollisionListener(onCollision)
}

/**
 * @function endSelecting
 * @description End selecting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function endSelecting(event) {
    if (!guiSelector) return 
    const collisionObject = guiSelector.getCollisionObject()
    if (collisionObject) {
        const selectable = uiSelectables.find(selectable => selectable.object3D.uuid === collisionObject.uuid)
        if (selectable) selectable.click()
    }
    clearGUISelector()
}

/**
 * @function clearGUISelector
 * @description Clear the GUI selector.
 * @returns {void}
 * @private
 */
function clearGUISelector() {
    if (guiSelector) {
        guiSelector.removeCollisionListener(onCollision)
        guiSelector.destroy()
        guiSelector = null
    }
}

/**
 * @function clearGUI
 * @description Clear the GUI.
 * @returns {void}
 * @private
 */
function clearGUI() {
    for (let i = 0; i < uiObjects.length; i++) {
        uiObjects[i].dispose()
    }

    uiObjects.length = 0
    uiSelectables.length = 0
}

/**
 * @class GUIHandler
 * @classdesc The GUI handler.
 */
class GUIHandler extends WebXRHandler {

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
        _view = view

        // Note: If the xr session is ended, clear the selected.
        view.renderer.xr.addEventListener('sessionend', clearGUISelector)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('squeezestart', startSelecting)
            controller.addEventListener('squeezeend', endSelecting)
        }

        this.initInvoker({ view, uiObjects, uiSelectables })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        clearGUI()
        clearGUISelector()

        _view.renderer.xr.removeEventListener('sessionend', clearGUISelector)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('squeezestart', startSelecting)
            controller.removeEventListener('squeezeend', endSelecting)
        }
    }
}

export default GUIHandler
