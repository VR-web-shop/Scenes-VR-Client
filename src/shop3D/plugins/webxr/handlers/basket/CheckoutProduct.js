import ContentObject from "./ui/checkout/ContentObject.js";

export default class CheckoutProduct {
    constructor(selectableProduct) {
        this.selectableProduct = selectableProduct;
    }

    getQuantity() {
        return this.selectableProduct.getProductEntitiesInUse().length
    }

    getPrice() {
        return this.selectableProduct.getPrice() * this.getQuantity()
    }

    getImageSource() {
        return this.selectableProduct.getImageSource()
    }

    onRemoveFromBasket() {
        this.selectableProduct.onRemoveFromBasket()
    }
    
    /**
     * Convert the product to a content object
     * that can be displayed in the checkout UI.
     */
    toContentObject() {
        return new ContentObject(
            this.getImageSource(), 
            this.getQuantity.bind(this), 
            this.getPrice.bind(this), 
            this.onRemoveFromBasket.bind(this)
        )
    }
}
