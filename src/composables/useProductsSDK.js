import ProductsSDK from '@vr-web-shop/products'
import SetWebXRValutaSettingCommand from '../shop3D/commands/webxr/checkout/SetWebXRValutaSettingCommand.js'
import { ref } from 'vue'

const SERVER_URL = import.meta.env.VITE_PRODUCTS_SERVER_URL
const sdk = new ProductsSDK(SERVER_URL)
const valuta = ref(null)

export function useProductsSDK() {

    async function start(shop) {
        /*const { rows } = await sdk.api.ValutaSettingController.findAll({
            limit: 1,
            where: {
                active: 1
            }
        })

        valuta.value = rows[0]
        */
        valuta.value = {
            name: 'Euro',
            short: 'EUR',
            symbol: '€'
        }
        await shop.invoke(new SetWebXRValutaSettingCommand(
            valuta.value.name,
            valuta.value.short,
            valuta.value.symbol
        ))
    }

    function getValuta() {
        return valuta.value
    }

    return {
        sdk,
        start,
        getValuta,
        valuta
    }
}