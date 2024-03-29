import QuantityObject from "./QuantityObject.js"

export default class QuantityManager {
    constructor(quantityObject = new QuantityObject(), onQuantityObjectChange = ()=>{}) {
        this.quantityObject = quantityObject

        // A reference to the function that will 
        // be called when the quantity object changes.
        this._onQuantityObjectChange = () => onQuantityObjectChange(
            this.quantityObject.quantity, 
            this.quantityObject.getMaxQuantity()
        )
    }

    increase() {
        if (this.quantityObject.getMaxQuantity() <= this.quantityObject.quantity) return

        this.quantityObject.quantity++
        this._onQuantityObjectChange()
    }

    decrease() {
        if (this.quantityObject.quantity <= 1) return

        this.quantityObject.quantity--
        this._onQuantityObjectChange()
    }

    setQuantityObject(quantityObject) {
        this.quantityObject = quantityObject
        this._onQuantityObjectChange()
    }

    getQuantityObject() {
        return this.quantityObject
    }
}
