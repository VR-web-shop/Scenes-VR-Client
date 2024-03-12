import * as THREE from 'three'
import SelectableBasket from '../select/selectables/SelectableBasket.js'

function Basket() {
    const selectOffset = new THREE.Vector3(0, 0, 0)
    const insertAreaOffset = new THREE.Vector3(0, 0, 0)
    const insertAreaSize = new THREE.Vector3(0, 0, 0)
    const selectedProducts = []
    let uiInterface = null
    let checkout = null
    let selected = null
    let selectable = null

    this.addSelectableProduct = function (product) {
        if (!(product instanceof SelectableBasket)) {
            throw new Error('The product is not a SelectableBasket')
        }

        
        selectedProducts.push(product)
        uiInterface.addElement(product)
        selectable.setPlaceholderVisibility(true)
    }

    this.removeSelectableProduct = function (product) {
        if (!(product instanceof SelectableBasket)) {
            throw new Error('The product is not a SelectableBasket')
        }

        const index = selectedProducts.indexOf(product)
        if (index !== -1) {
            selectedProducts.splice(index, 1)
        }

        if (selectedProducts.length === 0) {
            selectable.setPlaceholderVisibility(false)
        }
    }

    this.setupInsertArea = function (offset, size) {
        insertAreaOffset.copy(offset)
        insertAreaSize.copy(size)
    }

    this.intersectsInsertArea = function (otherBox) {
        const box = new THREE.Box3().setFromCenterAndSize(insertAreaOffset, insertAreaSize)
        return box.intersectsBox(otherBox)
    }

    /**
     * @function setUIInterface
     * @description Set the UI interface.
     * @param {Object} newUIInterface - The new UI interface.
     * @example setUIInterface({
     *   checkout: { addCheckoutListener, removeCheckoutListener, setTotal },
     *   content: { setElements, addElement, removeElement, removeElements },
     *   show, hide, setPosition, setRotation
     * })
     */
    this.setUIInterface = async function (newUIInterface) {
        uiInterface = newUIInterface
    }

    /**
     * @function setOffset
     * @description Set the select offset.
     * @param {THREE.Vector3} offset - The offset.
     * @returns {void}
     */
    this.setOffset = function (offset) {
        selectOffset.copy(offset)
    }

    /**
     * @function setSelectable
     * @description Set the selectable.
     * @param {Object} newSelectable - The new selectable.
     * @returns {void}
     */
    this.setSelectable = function (newSelectable) {
        selectable = newSelectable
    }

    /**
     * @function removeSelectable
     * @description Remove the selectable.
     * @returns {void}
     */
    this.removeSelectable = function () {
        selectable = null
    }

    /**
     * @function getSelectable
     * @description Get the selectable.
     * @returns {Object} The selectable.
     */
    this.getSelectable = function () {
        return selectable
    }



    /**
     * @function getBox
     * @description Get the box.
     * @returns {THREE.Box3} The box.
     */
    this.getBox = function () {
        const mesh = selectable.mesh
        const box = new THREE.Box3().setFromObject(mesh)
        return box
    }

    /**
     * @function grap
     * @description Grap the selectable.
     * @param {Object} controller - The controller.
     * @returns {void}
     */
    this.grap = function (controller) {
        if (selected || !selectable) {
            return
        }

        if (checkout) {
            checkout = null
            uiInterface.hide()
        }
        
        selected = controller;
        selectable.select(controller)
    }

    /**
     * @function release
     * @description Release the selectable.
     * @returns {void}
     */
    this.release = function () {
        if (!selected) {
            return
        }

        selected = null
    }

    /**
     * @function addToCheckout
     * @description Add to the checkout.
     * @param {Object} value - The value.
     * @returns {void}
     */
    this.addToCheckout = function (value) {
        if (selected) selected = null
        checkout = value
        
        selectable.mesh.position.copy(checkout.getCenterSurface())
        selectable.mesh.visible = true

        uiInterface.show()
        uiInterface.setPosition(checkout.getUIPosition())
        uiInterface.setRotation(checkout.getUIEulerRotation())
    }

    /**
     * @function hasSelected
     * @description Check if there is a selected.
     * @returns {boolean} If there is a selected.
     */
    this.hasSelected = function () {
        return selected !== null
    }

    this.getSelected = function () {
        return selected
    }
}

export default Basket
