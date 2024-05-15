import { useShoppingCartSDK } from './useShoppingCartSDK.js';
import { useSceneSDK } from './useScenesSDK.js';
import { useCheckout } from './useCheckout.js';
import { ref, toRaw } from 'vue';

const products = ref([])
const count = ref(0)
const showBasket = ref(false)

export function useShoppingCart() {

    const toggle = () => {
        showBasket.value = !showBasket.value
    }
    const startCheckout = async () => {
        const shoppingCart = useShoppingCartSDK()
        await shoppingCart.startCheckout()
    }

    const reloadCart = async () => {
        const shoppingCart = useShoppingCartSDK()
        await shoppingCart.createOrFindCart()
        const cartProductEntities = shoppingCart._cartProductEntities.value 
        
        /**
         * Setup cart products
         */
        
        const productsArr = []
        const { sdk: scenesSDK } = useSceneSDK()
        for (const cartProductEntity of cartProductEntities) {

            const productEntity = await scenesSDK.api.ProductEntityController.find({ 
                uuid: cartProductEntity.product_entity_client_side_uuid,
            })
            
            const exist = productsArr.find(p => {
                return p.uuid === productEntity.product_uuid
            })
    
            if (exist) {
                exist.quantity++
                exist.cartProductEntities.push(toRaw(cartProductEntity))
                continue
            }
            
            const product = await scenesSDK.api.ProductController.find({ 
                uuid: productEntity.product_uuid,
            })

            productsArr.push({ 
                ...product, 
                quantity: 1, 
                cartProductEntities: [toRaw(cartProductEntity)] 
            })
        }
        
        count.value = productsArr.length
        products.value = productsArr
    }

    return {
        products,
        count,
        showBasket,
        toggle,
        startCheckout,
        reloadCart,
    }
}
