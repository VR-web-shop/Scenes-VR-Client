import * as THREE from 'three'

function Basket() {
    const selectOffset = new THREE.Vector3(0, 0, 0)
    let checkout = null
    let interval = null
    let selected = null
    let mesh = null

    this.setOffset = function (offset) {
        selectOffset.copy(offset)
    }

    this.addMesh = function (basketMesh) {
        mesh = basketMesh
    }

    this.removeMesh = function () {
        mesh = null
    }

    this.getMesh = function () {
        return mesh
    }

    this.getBox = function () {
        const box = new THREE.Box3().setFromObject(mesh)
        return box
    }

    this.followSelected = function () {
        if (selected && mesh) {
            
        console.log(selected, mesh)
            mesh.position.copy(selected.position).add(selectOffset)
        }
    }

    this.grap = function (controller) {
        if (selected || !mesh) {
            return
        }

        selected = controller;
        this.followSelected()
        mesh.visible = true
        
        interval = setInterval(() => {
            this.followSelected()
        }, 1000 / 60)
    }

    this.release = function () {
        if (selected) {
            selected = null
            mesh.visible = false
        }

        if (interval) {
            clearInterval(interval)
            interval = null
        }
    }

    this.addToCheckout = function (value) {
        checkout = value
        this.release()
        mesh.position.copy(checkout.getCenterSurface())
        mesh.visible = true
    }

    this.removeFromCheckout = function () {
        checkout = null
        mesh.visible = false
    }

    this.hasSelected = function () {
        return selected !== null
    }

    this.addUI = function (ui) {
        this.ui = ui
    }
}

export default Basket
