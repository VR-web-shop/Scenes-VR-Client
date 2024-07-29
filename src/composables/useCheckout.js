import { ref } from 'vue'
import { computed } from 'vue'
import { useShoppingCartSDK } from './useShoppingCartSDK.js'
import { useSceneSDK } from './useScenesSDK.js'
import AddWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutListenerCommand.js'
import RemoveWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRCheckoutListenerCommand.js'

const cart = ref(null)
const CartProductEntities = ref([])
const products = ref([])
const productOrder = ref(null)
const deliveryOptions = ref([])
const paymentOptions = ref([])

const show = computed(()=>cart.value && cart.value.cart_state_name === 'WAITING_FOR_CHECKOUT')

export const useCheckout = () => {
    const shoppingCartCtrl = useShoppingCartSDK()

    async function start(shop) {
    }

    async function exit(shop) {
    }

    async function loadCart() {
        cart.value = await shoppingCartCtrl.createOrFindCart()
        CartProductEntities.value = shoppingCartCtrl._cartProductEntities.value;

        return cart.value
    }

    async function loadDeliveryOptions() {
        const { rows } = await shoppingCartCtrl.sdk.DeliverOption.findAll({ limit: 100 })
        deliveryOptions.value = rows
    }

    async function loadPaymentOptions() {
        const { rows } = await shoppingCartCtrl.sdk.PaymentOption.findAll({ limit: 100 })
        paymentOptions.value = rows
    }

    async function loadProductOrder() {
        const { product_order } = await shoppingCartCtrl.sdk.Cart.find(cart.value.client_side_uuid, 'product_order');

        productOrder.value = product_order;
    }

    async function setupProducts() {
        const duplicatedProductEntities = {}
        const scenesSDK = useSceneSDK()
        for (const cartProductEntity of CartProductEntities.value) {

            if (duplicatedProductEntities[cartProductEntity.product_client_side_uuid]) {
                duplicatedProductEntities[cartProductEntity.product_client_side_uuid].entities.push(cartProductEntity)
            } else {
                const productEntity = await scenesSDK.sdk.ProductEntity.find( 
                    cartProductEntity.product_entity_client_side_uuid,
                )
                
                const product = await scenesSDK.sdk.Product.find( 
                    productEntity.product_client_side_uuid,
                )

                cartProductEntity.product_client_side_uuid = productEntity.product_client_side_uuid
    
                duplicatedProductEntities[productEntity.product_client_side_uuid] = {
                    entities: [productEntity],
                    product: product
                }
            }
        }
        
        products.value = Object.values(duplicatedProductEntities)
    }

    const reloadCheckout = async () => {
        await loadCart()

        const isNotWaitingForCheckout = cart.value.cart_state_name !== 'WAITING_FOR_CHECKOUT'
        if (isNotWaitingForCheckout) {
            console.log('Cart is not waiting for checkout')
            return
        }

        await loadDeliveryOptions()
        await loadPaymentOptions()
        await loadProductOrder()
        await setupProducts()
    }

    const setProductOrder = async (newProductOrder) => {
        productOrder.value = newProductOrder
    }

    return {
        start,
        exit,
        cart,
        products,
        productOrder,
        deliveryOptions,
        paymentOptions,
        show,
        reloadCheckout,
        setProductOrder,
    }
}
