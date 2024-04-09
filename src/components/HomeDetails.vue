<template>
    <div>
        <div class="text-center p-6 bg-black/60 shadow-lg text-white flex justify-between gap-3">
            <div class="w-full">
                <h1 class="text-2xl font-bold mb-1 tracking-wider">
                    Electronics Hub VR
                </h1>

                <small class="text-orange-500 font-bold text-xs uppercase mb-1">
                    Unlock the Gateway to Your Virtual Realm.
                </small>

                <p class="text-gray-300 text-sm mb-3">
                    Dive into a world of immersive experiences with our cutting-edge virtual reality electronics.
                </p>
            </div>
        </div>

        <div class="px-10 py-24 text-gray-800 max-w-3xl mx-auto">
            <h2 class="font-bold text-center text-5xl mb-6">
                Ready to start shopping?
            </h2>

            <p class="font-bold text-center text-md mb-16">
                We are excited to welcome you to our virtual reality shopping experience! Get comfortable, put on your
                VR headset and follow the steps below to start shopping.
            </p>

            <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-16 px-10">

                <div class="flex justify-center gap-3">
                    <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                        <div>
                            <div class="text-2xl text-center font-bold">
                                1.
                            </div>
                            <VRIcon fill="white" width="2em" height="2em" />
                        </div>
                    </div>
                    <div class="text-sm text-center font-bold">
                        Find your favorite VR headset with a
                        built-in browser or connect your VR
                        headset to your computer.
                    </div>
                </div>

                <div class="flex justify-center gap-3">
                    <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                        <div>
                            <div class="text-2xl text-center font-bold">
                                2.
                            </div>
                            <PointIcon fill="white" width="2em" height="2em" />
                        </div>
                    </div>
                    <div class="text-sm text-center font-bold">
                        Put on your VR headset and press the
                        'Enter VR'-button below to start the
                        virtual reality experience.
                    </div>
                </div>

                <div class="flex justify-center gap-3">
                    <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                        <div>
                            <div class="text-2xl text-center font-bold">
                                3.
                            </div>
                            <BasketIcon fill="white" width="2em" height="2em" />
                        </div>
                    </div>
                    <div class="text-sm text-center font-bold">
                        Navigate through the scene using teleportation and use
                        the pocket near your body to pull out a basket to add
                        products to your cart.
                    </div>
                </div>

                <div class="flex justify-center gap-3">
                    <div class="rounded-full px-8 w-24 h-24 bg-orange-500 text-white flex items-center justify-center">
                        <div>
                            <div class="text-2xl text-center font-bold">
                                4.
                            </div>
                            <TruckIcon fill="white" width="2em" height="2em" />
                        </div>
                    </div>
                    <div class="text-sm text-center font-bold">
                        Place the basket on a checkout area to initiate a new
                        checkout. As soon as you have completed the checkout,
                        we will deliver your products to your doorstep!
                    </div>
                </div>

            </div>
        </div>

        <div class="px-10 py-24 bg-black text-white">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    We have selected a few products for you!
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    Every product below can be found in our virtual reality store. We have selected a few products for
                    you to get started with. If you are ready to start shopping, put on your VR headset and follow the
                    steps below.
                </p>

                <RandomProducts class="mb-16" />

                <div>
                    <p class="font-bold text-center text-md mb-6">
                        You can also find our full selection of products by clicking the button below.
                    </p>

                    <div class="text-center">
                        <router-link to="/products"
                            class="text-white p-3 rounded-md bg-blue-500 cursor-pointer">Find
                            products</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-white text-black">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Everything for the gamer or the tech enthusiast!
                </h2>

                <p class="font-bold text-center text-md mb-3">
                    As gamers we know how important it is to have the right gear. Find your favorite gaming chair, desk
                    or other gaming accessories in our virtual reality store today!
                </p>

                <div class="flex items-center justify-center px-10 mb-3">
                    <img src="/images/ProductsVariation2.png" alt="Products" class="w-full" />
                </div>

                <div>
                    <p class="font-bold text-center text-md mb-6">
                        Need help finding the right gear?<br />Contact us today and we will help you find the right gear
                        for your needs.
                    </p>

                    <div class="text-center">
                        <router-link to="/contact"
                            class="text-white p-3 rounded-md bg-blue-500 cursor-pointer">Contact us</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-black text-white">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Comfort and style for your home!
                </h2>

                <p class="font-bold text-center text-md mb-16">
                    Our selection of office chairs will make your home office a comfortable and stylish place to work.
                    Find your favorite chair in our virtual reality store today!
                </p>

                <div class="flex items-center justify-center px-10 mb-16">
                    <img src="/images/Chairs2.png" alt="Chairs" class="max-w-screen-sm" />
                </div>

                <div>
                    <p class="font-bold text-center text-md mb-6">
                        Want to learn more about how we select our products?<br />Read more about us by clicking the
                        button below.
                    </p>

                    <div class="text-center">
                        <router-link to="/about"
                            class="text-white p-3 rounded-md bg-blue-500 cursor-pointer">Learn more now</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-white text-black">
            <div class="max-w-3xl mx-auto">
                <h2 class="font-bold text-center text-5xl mb-6">
                    Custom designed USB sticks!
                </h2>

                <p class="font-bold text-center text-md mb-6">
                    We made these custom designed USB sticks for you to store your favorite games, movies or other
                    files. A size for almost every need!
                </p>

                <div class="flex items-center justify-center px-10 mb-6">

                    <img src="/images/USB.png" alt="Chairs" class="w-full" />

                </div>

                <div>
                    <CustomUSBProducts />
                </div>
            </div>
        </div>

        <div class="px-10 py-24 bg-black text-white">
            <h2 class="font-bold text-center text-5xl mb-6">
                Ready to start shopping?
            </h2>

            <p class="font-bold text-center text-md mb-6">
                Jump into the shop by clicking the button below or browse through our selection of products.
            </p>

            <div class="flex items-center justify-center gap-3 w-full">
                <StartVRButton class="px-3 py-3" />
                <div class="w-1 bg-gray-500/50 h-12 rounded-md ml-1 mr-1">
                </div>
                <router-link to="/products" class="text-white p-3 rounded-md bg-blue-500">Find
                    products</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import PointIcon from './icons/PointIcon.vue';
import VRIcon from '../components/icons/VRIcon.vue';
import BasketIcon from '../components/icons/BasketIcon.vue';
import TruckIcon from '../components/icons/TruckIcon.vue';
import RandomProducts from './products/RandomProducts.vue';
import CustomUSBProducts from './products/CustomUSBProducts.vue';
import StartVRButton from './VR/StartVRButton.vue';
</script>