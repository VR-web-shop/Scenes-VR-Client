import { createRouter, createWebHashHistory } from 'vue-router'

import NotFound from './layout/NotFound.vue'
import Home from './pages/Home.vue'
import Product from './pages/Product.vue'
import Products from './pages/Products.vue'
import Contact from './pages/Contact.vue'
import About from './pages/About.vue'
import Privacy from './pages/Privacy.vue'
import Terms from './pages/Terms.vue'
import Cookies from './pages/Cookies.vue'

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/', component: Home, name: 'Home' },
    { path: '/product/:client_side_uuid', component: Product, name: 'Product' },
    { path: '/products', component: Products, name: 'Products' },
    { path: '/contact', component: Contact, name: 'Contact' },
    { path: '/about', component: About, name: 'About' },
    { path: '/privacy', component: Privacy, name: 'Privacy' },
    { path: '/terms', component: Terms, name: 'Terms' },
    { path: '/cookies', component: Cookies, name: 'Cookies' },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
