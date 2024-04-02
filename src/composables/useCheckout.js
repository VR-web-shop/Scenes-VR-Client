import { ref } from 'vue'
import { computed } from 'vue'
import { useShoppingCartSDK } from './useShoppingCartSDK.js'

const shoppingCartCtrl = useShoppingCartSDK()
const cart = ref(null)
const productOrder = ref(null)
const products = ref([])
const show = computed(()=>cart.value && cart.value.cart_state_name === 'WAITING_FOR_CHECKOUT')

export const useCheckout = () => {

    const reloadCheckout = async () => {
        cart.value = await shoppingCartCtrl.createOrFindCart()
        cart.value = await shoppingCartCtrl.sdk.api.CartController.find({ uuid: cart.value.uuid }, {
            customParams: { access_token: shoppingCartCtrl.CartToken.get() },
            include: 'product_entities'
        })

        if (cart.value.cart_state_name !== 'WAITING_FOR_CHECKOUT') {
            return
        }

        const { rows } = await shoppingCartCtrl.sdk.api.ProductOrderController.findAll({
            limit: 1,
            where: { 
                cart_uuid: cart.value.uuid,
                product_order_state_name: 'WAITING_FOR_PAYMENT' 
            }
        })

        productOrder.value = rows[0]
    
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

    return {
        cart,
        products,
        show,
        reloadCheckout
    }
}
