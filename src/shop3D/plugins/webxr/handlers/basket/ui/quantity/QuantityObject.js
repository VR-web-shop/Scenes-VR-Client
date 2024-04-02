
export default class QuantityObject {
    constructor(
        quantity = 1, 
        getMaxQuantity=()=>1, 
        onConfirmQuantity=(quantityObject)=>{}, 
        onCancelQuantity=(quantityObject)=>{}) {
        this.quantity = quantity
        this.getMaxQuantity = getMaxQuantity
        this.onConfirmQuantity = onConfirmQuantity
        this.onCancelQuantity = onCancelQuantity
    }

    getQuantity() {
        return this.quantity
    }
}
