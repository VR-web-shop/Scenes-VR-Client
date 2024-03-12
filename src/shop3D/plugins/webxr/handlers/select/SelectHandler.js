import WebXRHandler from '../../abstractions/WebXRHandler.js'
import Selectable from './Selectable.js'
import * as THREE from 'three'

/**
 * @property selectables - The selectables.
 */
const selectables = []

/**
 * @property selectOffset - The select offset.
 */
const selectOffset = new THREE.Vector3()

/**
 * @property _view - The view.
 */
let _view = null

/**
 * @property selected - The selected.
 */
let selected = null

/**
 * @function updateSelected
 * @description Update the selected object's position.
 * @returns {void}
 * @private
 */
function updateSelected() {
    if (selected) {
        const nextPosition = selected.target.position.clone().sub(selectOffset)
        selected.selectable.setPosition(nextPosition)
    }
}

/**
 * @function setSelected
 * @description Set the selected.
 * @param {THREE.Object3D} target - The target.
 * @param {Selectable} selectable - The selectable.
 * @returns {void}
 */
function setSelected(target, selectable) {
    if (selected) clearSelected()
    selected = { target, selectable }
    selected.selectable.onSelect()
    selectOffset.copy(target.position).sub(selectable.mesh.position)
    _view.addBeforeRenderListener(updateSelected)
}

/**
 * @function startSelecting
 * @description Start selecting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function startSelecting(event) {
    const target = event.target;
    const box = new THREE.Box3().setFromObject(target);
    const selectable = selectables.find(selectable => selectable.intersectsBox(box))
    if (selectable) setSelected(target, selectable)
}

/**
 * @function clearSelected
 * @description Clear the selected.
 * @returns {void}
 * @private
 */
function clearSelected(event) {
    if (selected) {
        _view.removeBeforeRenderListener(updateSelected)
        selected.selectable.onDeselect()
        selected = null
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
        Selectable.setHandler(this)
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
        view.renderer.xr.addEventListener('sessionend', clearSelected)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('squeezestart', startSelecting)
            controller.addEventListener('squeezeend', clearSelected)
        }

        this.initInvoker({ selectables, setSelected })
    }

    /**
     * @function exit
     * @description Dispose the handler.
     * @returns {void}
     */
    exit() {
        selectables.length = 0
        clearSelected()

        _view.renderer.xr.removeEventListener('sessionend', clearSelected)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('squeezestart', startSelecting)
            controller.removeEventListener('squeezeend', clearSelected)
        }
    }
}

export default SelectHandler
