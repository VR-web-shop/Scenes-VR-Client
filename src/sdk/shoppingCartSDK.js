import { useToast } from "../composables/useToast.js"

const toast = useToast()
const SERVER_URL = `${import.meta.env.VITE_SHOPPING_CART_SERVER_URL}/api/v1`


export function shoppingCartSDK() {
    const request = async (endpoint, method='GET', body=null, useCartAuth=false) => {
        const params = { method, headers: {} }

        if (useCartAuth) {
            console.log('Using cart auth', endpoint)
            const token = localStorage.getItem('cart_access_token')
            if (!token) throw new Error('No cart token found')
            params.headers['Authorization'] = 'Bearer ' + token
        }  else {
            console.log('Not using cart auth', endpoint)
        }       

        if (body) {
            params.body = JSON.stringify(body)
            params.headers['Content-Type'] = 'application/json'
        }

        const response = await fetch(`${SERVER_URL}${endpoint}`, params)

        if (!response.ok) {
            toast.add('Failed to fetch data', 5000, 'error')
            throw new Error('Failed to fetch data')
        }   

        if (method === 'DELETE') return
        
        return await response.json()
    }

    const api = (plural, singular, pkName, options={}) => {
        const methods = {}

        if (options.find) {
            methods.find = async (pk, relation=null) => {
                const url = relation 
                    ? `${singular}/${options.addIDToSingular ? pk : ''}${relation}`
                    : `${singular}/${options.addIDToSingular ? pk : ''}`
                return await request(url, 'GET', null, options.find.useCartAuth)
            }
        }

        if (options.findAll) {
            methods.findAll = async () => {
                return await request(`${plural}`, 'GET', null, options.findAll.useCartAuth)
            }
        }

        if (options.create) {
            methods.create = async (data) => {
                return await request(`${plural}`, 'POST', data, options.create.useCartAuth)
            }
        }

        if (options.update) {
            methods.update = async (data) => {
                return await request(`${singular}${options.addIDToSingular ? data[pkName] : ''}`, 'PATCH', {...data}, options.update.useCartAuth)
            }
        }

        if (options.remove) {
            methods.remove = async (data={}) => {
                return await request(`${singular}${options.addIDToSingular ? data[pkName] : ''}`, 'DELETE', {...data}, options.remove.useCartAuth)
            }
        }
        
        return methods
    }

    const Cart = api('/carts', '/cart', 'client_side_uuid', {
        find: { useCartAuth: true },
        findAll: { useCartAuth: true },
        create: { useCartAuth: false },
        update: { useCartAuth: true },
    })

    const CartProductEntity = api('/cart_product_entities', '/cart_product_entity/', 'client_side_uuid', {
        find: { useCartAuth: true },
        findAll: { useCartAuth: true },
        create: { useCartAuth: true },
        remove: { useCartAuth: true },
        addIDToSingular: true,
    })

    const CartState = api('/cart_states', '/cart_state/', 'name', {
        find: { useCartAuth: false },
        findAll: { useCartAuth: false },
        addIDToSingular: true,
    })

    const DeliverOption = api('/deliver_options', '/deliver_option/', 'name', {
        find: { useCartAuth: false },
        findAll: { useCartAuth: false },
        addIDToSingular: true,
    })

    const PaymentOption = api('/payment_options', '/payment_option/', 'name', {
        find: { useCartAuth: false },
        findAll: { useCartAuth: false },
        addIDToSingular: true,
    })

    const ProductOrder = api('/product_orders', '/product_order', 'client_side_uuid', {
        find: { useCartAuth: true },
        findAll: { useCartAuth: true },
        create: { useCartAuth: true },
        update: { useCartAuth: true },
        remove: { useCartAuth: true },
        addIDToSingular: false,
    })

    return {
        Cart,
        CartProductEntity,
        CartState,
        DeliverOption,
        PaymentOption,
        ProductOrder,
    }
}
