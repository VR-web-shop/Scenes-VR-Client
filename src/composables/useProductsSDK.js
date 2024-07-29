import ProductsSDK from '@vr-web-shop/products'
import SetWebXRValutaSettingCommand from '../shop3D/commands/webxr/checkout/SetWebXRValutaSettingCommand.js'
import { ref } from 'vue'

const SERVER_URL = import.meta.env.VITE_PRODUCTS_SERVER_URL
const sdk = new ProductsSDK(SERVER_URL)
const valuta = ref(null)

export function useProductsSDK() {
    async function start(shop=null) {
        if (valuta.value) {
            return
        }
        const response = await fetch(SERVER_URL + `/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: `{ valutaSettings(limit: 100, page: 1) {
                __typename
                ... on ValutaSettings {
                    rows {
                        clientSideUUID 
                        name 
                        symbol 
                        symbol 
                        short 
                        active 
                        created_at 
                        updated_at
                    }
                    pages
                    count
                }
                ... on RequestError {
                    message
                    code
                }
            }}`}),
        })
        
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        const rows = data.data.valutaSettings.rows;
        const active = rows.filter(row => row.active)
        if (active.length === 0) {
            valuta.value = {
                name: 'Euro',
                short: 'EUR',
                symbol: '€'
            }
        } else {
            valuta.value = active[0]
        }
        
        if (!shop) {
            return
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