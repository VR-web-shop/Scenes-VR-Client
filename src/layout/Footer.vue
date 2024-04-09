<template>
    <footer class="text-xs border-t border-gray-300">
        <div class="bg-white text-black flex items-start justify-center gap-36 p-10">
            <div class="text-gray-500">
                <p>&copy; 2024 - Electronics Hub VR</p>
            </div>

            <div class="flex items-start justify-center gap-6">
                <div class="flex flex-col gap-1 text-left">
                    <p class="font-bold mb-1">Menu</p>
                    <router-link to="/" class="text-blue-500">Home</router-link>
                    <router-link to="/products" class="text-blue-500">Products</router-link>
                    <router-link to="/about" class="text-blue-500">About</router-link>
                    <router-link to="/contact" class="text-blue-500">Contact</router-link>
                </div>

                <div class="flex flex-col gap-1 text-left">
                    <p class="font-bold mb-1">Extra</p>
                    <router-link to="/privacy" class="text-blue-500">Privacy Policy</router-link>
                    <router-link to="/terms" class="text-blue-500">Terms of Service</router-link>
                    <router-link to="/cookies" class="text-blue-500">Cookies</router-link>
                </div>
            </div>
        </div>

        <div class="bg-black text-white flex justify-center gap-1 p-1">
            Looking for help? <a class="text-blue-600" href="mailto:support@example.com">support@example.com</a>
        </div>
    </footer>
</template>