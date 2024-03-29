import ContentObject from "./ui/checkout/ContentObject.js";
import QuantityObject from "./ui/quantity/QuantityObject.js";

export default class CheckoutProduct {
    constructor(selectableProduct) {
        this.selectableProduct = selectableProduct;
    }

    getQuantity() {
        return this.selectableProduct.getSelectedProductEntities().length
    }

    getMaxQuantity() {
        return this.selectableProduct.getProductEntities().length
    }

    getPrice() {
        return this.selectableProduct.getPrice() * this.quantity()
    }

    getImageSource() {
        return this.selectableProduct.getImageSource()
    }

    onRemoveFromBasket() {
        this.selectableProduct.removeFromBasket()
    }
    
    /**
     * Convert the product to a content object
     * that can be displayed in the checkout UI.
     */
    toContentObject() {
        return new ContentObject(
            this.getImageSource(), 
            this.getQuantity(), 
            this.getPrice(), 
            this.onRemoveFromBasket
        )
    }

    /**
     * Convert the product to a quantity object
     * that can be displayed in the quantity UI.
     */
    toQuantityObject() {
        return new QuantityObject(
            this.getQuantity(), 
            this.getMaxQuantity
        )
    }
}
