import ShoppingCartSDK from '@vr-web-shop/shopping-cart'
import { useCheckout } from './useCheckout.js'
import { ref, toRaw } from 'vue'

import AddWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutListenerCommand'
import AddWebXRAddProductListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRAddProductListenerCommand'
import AddWebXRReservedProductEntitiesCommand from '../shop3D/commands/webxr/checkout/AddWebXRReservedProductEntitiesCommand'

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
        await loadCart(shop)
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
    }

    async function loadCart(shop) {
        const cart = await createOrFindCart();
        
        if (cart.ProductEntity) {
            for (const productEntity of cart.ProductEntity) {
                const {rows} = await sdk.api.ProductEntityController.findAll({
                    limit: 1,
                    where: {uuid: productEntity.uuid},
                    include: [{model: 'Product'}]
                })
                console.log('rows', rows)
                await shop.invoke(new AddWebXRReservedProductEntitiesCommand(rows[0].Product.uuid, [toRaw(productEntity)]))
            }
        }
    }
    
    async function createOrFindCart() {
        // If the cart is already created, return it
        if (_cart.value) return _cart.value

        // If we got a cart from earlier saved in the local storage, return it
        const uuid = CartToken.getCartUUID()
        if (uuid) {
            try {
                _cart.value = await sdk.api.CartController.find({ uuid }, {
                    customParams: {access_token: CartToken.get()},
                    include: 'product_entities'
                })
                return _cart.value
            } catch (error) {
                console.error('Cart not found', error)
            }
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
        const product = event.data.selectableProduct
       
        for (const productEntity of product.productEntitiesInUse) {
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
        
        const product = event.data.checkoutProduct.selectableProduct
        const productEntitiesInUse = event.data.productEntitiesInUse

        const refreshedCart = await sdk.api.CartController.find({ uuid: cart.uuid }, {
            customParams: {access_token: CartToken.get()},
            include: 'product_entities'
        })

        for (const productEntity of productEntitiesInUse) {
            const entity = refreshedCart.ProductEntity.find(entity => entity.uuid === productEntity.uuid)

            await sdk.api.CartProductEntityController.update({
                uuid: entity.CartProductEntity.uuid,
                cart_uuid: cart.uuid, 
                product_entity_uuid: productEntity.uuid,
                access_token
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
        
        await sdk.api.CartController.update({
            uuid: cart.uuid,
            access_token: CartToken.get(),
            cart_state_name: CART_STATES.WAITING_FOR_CHECKOUT
        })
        
        const checkoutCtrl = useCheckout()
        await checkoutCtrl.reloadCheckout()
    }

    async function cancelCheckout() {
        const cart = await createOrFindCart()

        await sdk.api.CartController.update({
            uuid: cart.uuid,
            access_token: CartToken.get(),
            cart_state_name: CART_STATES.OPEN_FOR_PRODUCT_ENTITIES
        })

        const checkoutCtrl = useCheckout()
        await checkoutCtrl.reloadCheckout()
    }
    
    return {
        sdk,
        start,
        exit,
        CartToken,
        createOrFindCart,
        cancelCheckout,
    }
}
