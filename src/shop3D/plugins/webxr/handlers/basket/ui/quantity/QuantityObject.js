
export default class QuantityObject {
    constructor(quantity = 1, getMaxQuantity=()=>1) {
        this.quantity = quantity
        this.getMaxQuantity = getMaxQuantity
    }
}
