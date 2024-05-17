import { shoppingCartSDK } from '../sdk/shoppingCartSDK.js'
import { useSceneSDK } from './useScenesSDK.js'
import { useCheckout } from './useCheckout.js'
import { useShoppingCart } from './useShoppingCart.js'
import { ref, toRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid';

import AddWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutListenerCommand'
import AddWebXRAddProductListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRAddProductListenerCommand'
import AddWebXRReservedProductEntitiesCommand from '../shop3D/commands/webxr/checkout/AddWebXRReservedProductEntitiesCommand'

import RemoveWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRCheckoutListenerCommand'
import RemoveWebXRAddProductListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRAddProductListenerCommand'


const SERVER_URL = import.meta.env.VITE_SHOPPING_CART_SERVER_URL
const sdk = new shoppingCartSDK(SERVER_URL)

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
    const _cartProductEntities = ref([])

    /**
     * When the shop starts, the shopping cart sdk
     * will listen for updates from the shop.
     */
    async function start(shop) {
        await shop.invoke(new AddWebXRCheckoutListenerCommand('startCheckout', startCheckout.bind(this)))
        await shop.invoke(new AddWebXRCheckoutListenerCommand('cancelCheckout', cancelCheckout.bind(this)))
        await shop.invoke(new AddWebXRAddProductListenerCommand('addProduct', addProductToCartEvent.bind(this)))
        await shop.invoke(new AddWebXRAddProductListenerCommand('removeProduct', removeFromCartEvent.bind(this)))
        await loadCart(shop)
    }

    /**
     * When the shop exits, the shopping cart sdk
     * will stop listening for updates from the shop.
     */
    async function exit(shop) {
        await shop.invoke(new RemoveWebXRCheckoutListenerCommand('startCheckout', startCheckout.bind(this)))
        await shop.invoke(new RemoveWebXRCheckoutListenerCommand('cancelCheckout', cancelCheckout.bind(this)))
        await shop.invoke(new RemoveWebXRAddProductListenerCommand('addProduct', addProductToCartEvent.bind(this)))
        await shop.invoke(new RemoveWebXRAddProductListenerCommand('removeProduct', removeFromCartEvent.bind(this)))
    }

    async function loadCart(shop) {
        await createOrFindCart();
        
        const scenesSDK = useSceneSDK()
        for (const cartProductEntity of _cartProductEntities.value) {
            const productEntity = await scenesSDK.sdk.api.ProductEntityController.find({ 
                uuid: cartProductEntity.product_entity_client_side_uuid,
            })
            
            await shop.invoke(new AddWebXRReservedProductEntitiesCommand(
                productEntity.product_uuid, [toRaw(productEntity)]
            ))
        }
    }
    
    async function createOrFindCart() {
        // If the cart is already created, return it
        if (_cart.value) return _cart.value

        // If we got a cart from earlier saved in the local storage, return it
        const uuid = CartToken.getCartUUID()
        if (uuid) {
            try {
                const result = await sdk.Cart.find(uuid, 'cart_product_entities')
                _cart.value = result.cart;
                _cartProductEntities.value = result.cart_product_entities;

                return _cart.value
            } catch (error) {
                console.error('Cart not found', error)
            }
        }
        
        // Otherwise, create a new cart
        const { cart, access_token } = await sdk.Cart.create({
            client_side_uuid: uuidv4(),
            cart_state_name: "OPEN_FOR_PRODUCT_ENTITIES"
        });

        _cart.value = cart
        CartToken.set(access_token)

        return _cart.value
    }

    async function getCartToken() {
        return CartToken.get()
    }

    async function addProductToCartEvent(event) {
        const product = event.data.selectableProduct
        const productEntitiesInUse = product.productEntitiesInUse
        
        await addProductToCart(productEntitiesInUse)
        useShoppingCart().reloadCart()
    }

    async function removeFromCartEvent(event) {
        const productEntitiesInUse = event.data.productEntitiesInUse
        
        await removeProductFromCart(productEntitiesInUse)
        useShoppingCart().reloadCart()
    }

    async function addProductToCart(productEntities) {
        const cart = await createOrFindCart()
       
        for (const productEntity of productEntities) {
            await sdk.CartProductEntity.create({
                client_side_uuid: uuidv4(),
                cart_client_side_uuid: cart.client_side_uuid, 
                product_entity_client_side_uuid: productEntity.uuid
            })
        }
    }

    async function removeProductFromCart(productEntitiesInUse) {
        const cart = await createOrFindCart()
        const cartProductEntities = _cartProductEntities.value
        
        for (const productEntity of productEntitiesInUse) {
            const entity = cartProductEntities.find(entity => {
                return entity.product_entity_client_side_uuid === productEntity.uuid
            })
            
            await sdk.CartProductEntity.remove({
                client_side_uuid: entity.client_side_uuid,
                cart_client_side_uuid: cart.client_side_uuid,
            })
        }
    }

    async function startCheckout() {
        const cart = await createOrFindCart()
        
        await sdk.Cart.update({
            client_side_uuid: cart.client_side_uuid,
            cart_state_name: CART_STATES.WAITING_FOR_CHECKOUT,
            product_order: {
                name: 'None',
                email: 'None',
                address: 'None',
                city: 'None',
                country: 'None',
                postal_code: 1234,
                deliver_option_client_side_uuid: 'aaa-bbb-ccc',
                payment_option_client_side_uuid: 'aaa-bbb-ccc',
            }
        })
        
        useCheckout().reloadCheckout()
    }

    async function cancelCheckout() {
        const cart = await createOrFindCart()

        await sdk.Cart.update({
            client_side_uuid: cart.client_side_uuid,
            cart_state_name: CART_STATES.OPEN_FOR_PRODUCT_ENTITIES
        })

        useCheckout().reloadCheckout()
    }
    
    return {
        sdk,
        start,
        exit,
        CartToken,
        createOrFindCart,
        startCheckout,
        cancelCheckout,
        getCartToken,
        addProductToCart,
        removeProductFromCart,
        _cartProductEntities
    }
}
