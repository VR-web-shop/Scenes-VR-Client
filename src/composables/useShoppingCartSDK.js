import ShoppingCartSDK from '@vr-web-shop/shopping-cart'
import { ref } from 'vue'

import AddWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutListenerCommand'
import AddWebXRAddProductListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRAddProductListenerCommand'

import RemoveWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRCheckoutListenerCommand'
import RemoveWebXRAddProductListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRAddProductListenerCommand'

const SERVER_URL = 'http://localhost:3004'
const sdk = new ShoppingCartSDK(SERVER_URL)

class CartToken {
    static get() {
        return localStorage.getItem('cart_access_token')
    }

    static set(token) {
        localStorage.setItem('cart_access_token', token)
    }

    static clear() {
        localStorage.removeItem('cart_access_token')
    }

    static exists() {
        return !!this.get()
    }

    static parse() {
        const token = this.get()
        if (!token) return null

        return JSON.parse(atob(token.split('.')[1]))
    }

    static getCartUUID() {
        const token = this.parse()
        return token ? token.sub : null
    }
}

const CART_STATES = {
    OPEN_FOR_PRODUCT_ENTITIES: 'OPEN_FOR_PRODUCT_ENTITIES',
    WAITING_FOR_CHECKOUT: 'WAITING_FOR_CHECKOUT',
}

export function useShoppingCartSDK() {
    // A value used to cache the cart.
    // Should not be accessed directly.
    // Use createOrFindCart instead.
    const _cart = ref(null)

    /**
     * When the shop starts, the shopping cart sdk
     * will listen for updates from the shop.
     */
    async function start(shop) {
        await shop.invoke(new AddWebXRCheckoutListenerCommand('startCheckout', startCheckout.bind(this)))
        await shop.invoke(new AddWebXRCheckoutListenerCommand('cancelCheckout', cancelCheckout.bind(this)))
        await shop.invoke(new AddWebXRAddProductListenerCommand('addProduct', addProductToCart.bind(this)))
        await shop.invoke(new AddWebXRAddProductListenerCommand('removeProduct', removeProductFromCart.bind(this)))
        await shop.invoke(new AddWebXRAddProductListenerCommand('clearCart', clearCart.bind(this)))
    }

    /**
     * When the shop exits, the shopping cart sdk
     * will stop listening for updates from the shop.
     */
    async function exit(shop) {
        await shop.invoke(new RemoveWebXRCheckoutListenerCommand('startCheckout', startCheckout.bind(this)))
        await shop.invoke(new RemoveWebXRCheckoutListenerCommand('cancelCheckout', cancelCheckout.bind(this)))
        await shop.invoke(new RemoveWebXRAddProductListenerCommand('addProduct', addProductToCart.bind(this)))
        await shop.invoke(new RemoveWebXRAddProductListenerCommand('removeProduct', removeProductFromCart.bind(this)))
        await shop.invoke(new RemoveWebXRAddProductListenerCommand('clearCart', clearCart.bind(this)))
    }
    
    async function createOrFindCart() {
        // If the cart is already created, return it
        if (_cart.value) return _cart.value

        // If we got a cart from earlier saved in the local storage, return it
        const uuid = CartToken.getCartUUID()
        if (uuid) {
            _cart.value = await sdk.api.CartController.find({ uuid }, {
                customParams: {access_token: CartToken.get()}
            })
            return _cart.value
        }
        
        // Otherwise, create a new cart
        const {cart, access_token} = await sdk.api.CartController.create({});
        
        _cart.value = cart
        CartToken.set(access_token)

        return _cart.value
    }

    async function addProductToCart(event) {
        const cart = await createOrFindCart()
        const access_token = CartToken.get()
        const product = event.product

        for (const productEntity of product.productEntities) {
            await sdk.api.CartProductEntityController.create({
                cart_uuid: cart.uuid, 
                product_entity_uuid: productEntity.uuid,
                access_token
            })
        }
    }

    async function removeProductFromCart(event) {
        const cart = await createOrFindCart()
        const access_token = CartToken.get()
        const product = event.product

        for (const productEntity of product.productEntities) {
            await sdk.api.CartProductEntityController.update({
                cart_uuid: cart.uuid, 
                product_entity_uuid: productEntity.uuid,
                customParams: { access_token }
            })
        }
    }

    async function clearCart() {
        const cart = await createOrFindCart()
        const cartProducts = await sdk.api.CartController.find(cart.uuid, {
            customParams: {access_token: CartToken.get()},
            include: 'ProductEntity'
        })

        for (const productEntity of cartProducts.ProductEntities) {
            await removeProductFromCart(productEntity)
        }
    }

    async function startCheckout() {
        const cart = await createOrFindCart()
        if (cart.cart_state_name === CART_STATES.WAITING_FOR_CHECKOUT) return

        await sdk.api.CartController.update({
            uuid: cart.value.uuid,
            customParams: {access_token: CartToken.get()},
            cart_state_name: CART_STATES.WAITING_FOR_CHECKOUT
        })
    }

    async function cancelCheckout() {
        const cart = await createOrFindCart()
        if (cart.cart_state_name === CART_STATES.OPEN_FOR_PRODUCT_ENTITIES) return

        await sdk.api.CartController.update({
            uuid: cart.value.uuid,
            customParams: {access_token: CartToken.get()},
            cart_state_name: CART_STATES.OPEN_FOR_PRODUCT_ENTITIES
        })
    }
    
    return {
        sdk,
        start,
        exit,
    }
}
