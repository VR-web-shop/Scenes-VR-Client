import { useShoppingCartSDK } from './useShoppingCartSDK.js';
import { useSceneSDK } from './useScenesSDK.js';
import { useCheckout } from './useCheckout.js';
import { ref } from 'vue';

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
        const cart = await shoppingCart.createOrFindCart()
        const token = await shoppingCart.getCartToken()
    
        const { rows } = await shoppingCart.sdk.api.CartProductEntityController.findAll({
            limit: 100,
            where: { cart_uuid: cart.uuid },
            customParams: {
                access_token: token,
                cart_uuid: cart.uuid,
            },
            include: [
                { model: 'ProductEntity' }
            ]
        })
    
        const productsArr = []
        const { sdk: scenesSDK } = useSceneSDK()
        for (const row of rows) {
            const exist = productsArr.find(p => p.uuid === row.ProductEntity.product_uuid)
    
            if (exist) {
                exist.quantity++
                exist.cartProductEntities.push(row)
                continue
            }
    
            const product = await scenesSDK.api.ProductController.find({ uuid: row.ProductEntity.product_uuid })
            productsArr.push({ ...product, quantity: 1, cartProductEntities: [row] })
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
