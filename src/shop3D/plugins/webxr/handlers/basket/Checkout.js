import CheckoutUI from "./CheckoutUI.js";
import * as THREE from 'three';

function Checkout(
    mesh, 
    surfaceOffset = new THREE.Vector3(0, 0, 0), 
    surfaceSize = new THREE.Vector3(1, 1, 1),
    UIOffset = new THREE.Vector3(0, 3, 0),
    UIRotation = new THREE.Euler(0, 0, 0)) {
    
    let basket = null

    this.intersectsBox = function (box) {
        const point = new THREE.Vector3()
        mesh.getWorldPosition(point).add(surfaceOffset)
        const box2 = new THREE.Box3().setFromCenterAndSize(point, surfaceSize)
        return box.intersectsBox(box2)
    }

    this.getCenterSurface = function () {
        const point = new THREE.Vector3()
        mesh.getWorldPosition(point).add(surfaceOffset)
        return point
    }

    this.getUIPosition = function () {
        return mesh.position.clone().add(UIOffset)
    }

    this.getUIEulerRotation = function () {
        return UIRotation
    }

    this.showHelper = function () {
        const pos = new THREE.Vector3().add(surfaceOffset)
        const box = new THREE.Box3().setFromCenterAndSize(pos, surfaceSize)
        const boxHelper = new THREE.Box3Helper(box, 0x00FF00)
        mesh.add(boxHelper)
    }

    this.addBasket = function (newSelectablesBasket) {
        basket = newSelectablesBasket
        basket.checkout = this

        basket.mesh.position.copy(this.getCenterSurface())
        basket.mesh.visible = true

        const _interface = CheckoutUI.getCheckoutInterface()
        _interface.show()
        _interface.setPosition(this.getUIPosition())
        _interface.setRotation(this.getUIEulerRotation())
        _interface.content.setElements(basket.inventory.products.map(p=>p.selectableProduct), (selectableProduct) => {
            basket.inventory.removeProduct(selectableProduct)
            selectableProduct.mesh.visible = true
        })
    }

    this.removeBasket = function () {
        basket.checkout = null
        basket = null

        const _interface = CheckoutUI.getCheckoutInterface()
        _interface.hide()
    }
}

export default Checkout;
