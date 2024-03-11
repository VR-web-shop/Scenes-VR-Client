import BasketUI from './BasketUI.js'
import * as THREE from 'three'

function Selectable() {
}

function Basket() {
    const selectOffset = new THREE.Vector3(0, 0, 0)
    const ui = new BasketUI()
    let checkout = null
    let selected = null
    let selectable = null

    this.setupUI = async function (scene) {
        await ui.init(scene)
    }

    this.setOffset = function (offset) {
        selectOffset.copy(offset)
    }

    this.addSelectable = function (newSelectable) {
        selectable = newSelectable
    }

    this.removeSelectable = function () {
        selectable = null
    }

    this.getSelectable = function () {
        return selectable
    }

    this.getBox = function () {
        const mesh = selectable.mesh
        const box = new THREE.Box3().setFromObject(mesh)
        return box
    }

    this.grap = function (controller, view) {
        if (selected || !selectable) {
            return
        }
        
        selected = controller;
        selectable.select(controller)
    }

    this.release = function (view) {
        if (!selected) {
            return
        }

        selected = null
    }

    this.addToCheckout = function (value) {
        checkout = value
        if (selected) this.release()
        selectable.mesh.position.copy(checkout.getCenterSurface())
        selectable.mesh.visible = true
        ui.show(selectable.mesh.position)
    }

    this.removeFromCheckout = function () {
        checkout = null
        selectable.mesh.visible = false
        ui.hide()
    }

    this.hasSelected = function () {
        return selected !== null
    }
}

export default Basket
