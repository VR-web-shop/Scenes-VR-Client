import { ref } from 'vue'
import { computed } from 'vue'
import { useShoppingCartSDK } from './useShoppingCartSDK.js'
import AddWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutListenerCommand.js'
import RemoveWebXRCheckoutListenerCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRCheckoutListenerCommand.js'

const cart = ref(null)
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
        cart.value = await shoppingCartCtrl.sdk.api.CartController.find({ uuid: cart.value.uuid }, {
            customParams: { access_token: shoppingCartCtrl.CartToken.get() },
            include: 'product_entities'
        })

        return cart.value
    }

    async function loadDeliveryOptions() {
        const { rows } = await shoppingCartCtrl.sdk.api.DeliverOptionController.findAll({ limit: 100 })
        deliveryOptions.value = rows
    }

    async function loadPaymentOptions() {
        const { rows } = await shoppingCartCtrl.sdk.api.PaymentOptionController.findAll({ limit: 100 })
        paymentOptions.value = rows
    }

    async function loadProductOrder() {
        const { rows } = await shoppingCartCtrl.sdk.api.ProductOrderController.findAll({
            limit: 1,
            where: { 
                cart_uuid: cart.value.uuid,
                product_order_state_name: 'WAITING_FOR_PAYMENT' 
            },
            include: [
                { model: 'ProductOrderState' },
                { model: 'DeliverOption' },
                { model: 'PaymentOption' }
            ]
        })

        productOrder.value = rows[0]
    }

    async function setupProducts() {
        const duplicatedProductEntities = {}
        for (const productEntity of cart.value.ProductEntity) {
            if (duplicatedProductEntities[productEntity.product_uuid]) {
                duplicatedProductEntities[productEntity.product_uuid].entities.push(productEntity)
            } else {
                const { rows } = await shoppingCartCtrl.sdk.api.ProductEntityController.findAll({
                    limit: 1,
                    where: { uuid: productEntity.uuid },
                    include: [{ model: 'Product' }]
                })
    
                duplicatedProductEntities[productEntity.product_uuid] = {
                    entities: [productEntity],
                    product: rows[0].Product
                }
            }
        }
        
        
        products.value = Object.values(duplicatedProductEntities)
    }

    const reloadCheckout = async () => {
        await loadCart()

        const isNotWaitingForCheckout = cart.value.cart_state_name !== 'WAITING_FOR_CHECKOUT'
        if (isNotWaitingForCheckout) {
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
