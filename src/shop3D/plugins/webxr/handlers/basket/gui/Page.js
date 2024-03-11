import SpatialUI from "../../../gui/SpatialUI.js"
import * as THREE from 'three';

class Page {
    constructor(parent) {
        this.container = new SpatialUI.SpatialUIContainer()
        this.parent = parent
        this.parent.addElement(this.container)
        this.eventDispatcher = new THREE.EventDispatcher()
    }

    addEventListener(type, listener) {
        this.eventDispatcher.addEventListener(type, listener)
    }

    removeEventListener(type, listener) {
        this.eventDispatcher.removeEventListener(type, listener)
    }

    show() {
        this.container.setVisbility(true)
        this.eventDispatcher.dispatchEvent({ type: 'show' })
    }

    hide() {
        this.container.setVisbility(false)
        this.eventDispatcher.dispatchEvent({ type: 'hide' })
    }

    closeParent() {
        this.parent.setVisbility(false)
    }
}

export default Page
